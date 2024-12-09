import { User } from '@prisma/client';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import prisma from '../../../shared/prisma';

import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { senMailer } from '../../../helpers/sendMailer';
import { resetPasswordHTML, resetPasswordSubject } from './resetPassword';
import { checkIsValidOTP, createActivationCode, } from './Auth.helper';
import { sendEmailFunc } from '../../../helpers/mail/sendMail';
import { registrationSuccessEmailBody } from '../../../helpers/mail/otp-template';

const signUpUserDB = async (
  userData:User & any
)=> {

  const isExistUser = await prisma.user.findUnique({
    where:{
      email:userData.email
    }
  })
  if (isExistUser) {
    if (!isExistUser?.is_active) {
      throw new ApiError(httpStatus.CONFLICT, "User is not active");
    }
    if (!isExistUser?.is_verified) {
      throw new ApiError(httpStatus.CONFLICT, "User is not verified");
    }
    throw new ApiError(httpStatus.CONFLICT, "User already exist");
  }

const activationOTP = createActivationCode()
const sendOtpMail = await sendEmailFunc({
  email: userData?.email,
  subject: 'Activate your Account',
  html: registrationSuccessEmailBody({
    name: userData?.email,
    activationCode: activationOTP,
  }),
});
console.log(sendOtpMail,'sendOtpMail')
const expiryTime = new Date(Date.now() + 15 * 60 * 1000);
  const hashedOTP = await bcrypt.hash(activationOTP, Number(5));
  userData.verify_code = hashedOTP;
  userData.verify_expiration = expiryTime;


  userData.password = await bcrypt.hash(
    userData.password,
    Number(config.bycrypt_salt_rounds)
  );

  const createUser= await prisma.user.create({
    data: userData,
  });
  return {
    email: createUser?.email,
    id: createUser?.id,
    role: createUser?.role,
  }
};

// old code
// const signUp = async (
//   userData: User
// ): Promise<{ data: User; accessToken: string }> => {
//   userData.password = await bcrypt.hash(
//     userData.password,
//     Number(config.bycrypt_salt_rounds)
//   );

//   // console.log("🚀 ~ file: Auth.service.ts:14 ~ userData:", userData)

//   // userData.role="user"

//   const result = await prisma.user.create({
//     data: userData,
//   });

//   const newAccessToken = jwtHelpers.createToken(
//     {
//       email: userData.email,
//       id: userData.id,
//       role: userData.role,
//     },
//     config.jwt.secret as Secret,
//     config.jwt.expires_in as string
//   );
//   return {
//     accessToken: newAccessToken,
//     data: result,
//   };
// };


const verifySignUpOtpDB = async (email: string, otp: string) => {
  const isValidOTP = await checkIsValidOTP({ email, code: otp });

  if (!isValidOTP.valid) {
    throw new ApiError(httpStatus.NOT_FOUND, 'OTP not found or already used');
  }

  await prisma.user.update({
    where: {
      email,
    },
    data: {
      is_verified: true,
      is_active: true,
      verify_code: null,
      verify_expiration: null,
    },
  });
};

const authLoginDB = async (payload: {
  email?: string;
  password: string;
}): Promise<any> => {
  const { email, password } = payload;

  // console.log(payload, 'payload');

  // const isUserExist = await User.isUserExistsMethod(phoneNumber);
  // // console.log(isUserExist,"isUserExits");

  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  // console.log(isUserExist);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }else{
    if (!isUserExist?.is_active) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User is not active');
    }
    if (!isUserExist?.is_verified) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User is not verified');
    }
  }

  const isPasswordMatch = await bcrypt.compare(password, isUserExist?.password);

  if (isUserExist.password && !isPasswordMatch) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Password is not correct');
  }

  //   jwt part ///
  const accessToken = jwtHelpers.createToken(
    {
      email,
      role: isUserExist.role,
      id: isUserExist.id,
      user_name: isUserExist.user_name,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    {
      email,
      role: isUserExist.role,
      id: isUserExist.id,
      user_name: isUserExist.user_name,
    },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string): Promise<any> => {
  //verify token
  // invalid token - synchronous
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }

  const { id } = verifiedToken;

  const isUserExist = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }
  //generate new token

  const newAccessToken = jwtHelpers.createToken(
    {
      id: isUserExist.id,
      role: isUserExist.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};

const changePasswordDB = async (
  authUser: any,
  passwordData: any
): Promise<any> => {
  const { id } = authUser;
  // console.log(authUser);
  const { oldPassword, newPassword } = passwordData;

  const password = await bcrypt.hash(
    newPassword,
    Number(config.bycrypt_salt_rounds)
  );

  const isUserExist = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  // console.log(isUserExist);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not match');
  }

  const isPasswordMatch = await bcrypt.compare(
    oldPassword,
    isUserExist?.password
  );

  if (isUserExist.password && !isPasswordMatch) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Old Password is not correct');
  }

  const updatePass = await prisma.user.update({
    where: {
      id,
    },
    data: {
      password,
    },
  });

  return updatePass;
};

const forgotPassword = async (passwordData: any): Promise<any> => {
  console.log('🚀passwordData:', passwordData);

  const isUserExist = await prisma.user.findUnique({
    where: {
      email: passwordData.email,
    },
  });
  // console.log(isUserExist);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User NOt Found');
  }

  const passResetToken = await jwtHelpers.createPassResetToken({
    id: isUserExist?.id,
    email: isUserExist.email,
  });
  const resetLink: string =
    config.frontend_url +
    '/resetPassword?' +
    `id=${isUserExist?.id}&token=${passResetToken}`;
  // console.log(passResetToken, '');
  await senMailer(
    resetPasswordSubject,
    isUserExist.email,
    resetPasswordHTML(resetLink)
  );

  return passResetToken;
};

const resetPassword = async (
  passwordData: {
    email: string;
    newPassword: string;
  },
  token: string
): Promise<any> => {
  // console.log(passwordData, token);

  const newPassword = await bcrypt.hash(
    passwordData.newPassword,
    Number(config.bycrypt_salt_rounds)
  );

  const isUserExist = await prisma.user.findUnique({
    where: {
      email: passwordData?.email,
    },
  });
  console.log(isUserExist);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User NOt Found');
  }

  const isVerified = await jwtHelpers.verifyToken(
    token,
    config.jwt.secret as Secret
  );
  if (!isVerified) {
    throw new ApiError(httpStatus.NOT_FOUND, 'token is expired');
  }

  const updatePass = await prisma.user.update({
    where: {
      email: isUserExist?.email,
    },
    data: {
      password: newPassword,
    },
  });

  return updatePass;
};
export const AuthService = {
  signUpUserDB,
  authLoginDB,
  changePasswordDB,
  forgotPassword,
  resetPassword,
  refreshToken,
  verifySignUpOtpDB
};
