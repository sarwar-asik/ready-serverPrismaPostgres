import { User } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import config from '../../../config';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AuthService } from './Auth.service';

export const signUpUser = catchAsync(
  async (req: Request, res: Response) => {
    const { ...user } = req.body;
    // console.log(user, 'from controller=================');
    const result = await AuthService.signUpUserDB(user);

    if (result) {
      sendResponse(res, {
        success: true,
        message: "sent OTP. Please, verify your email/finger",
        statusCode: 200,
        data: result,
      });
    }
  }
);

export const verifySignUpOtp = catchAsync(
  async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    const result = await AuthService.verifySignUpOtpDB(email, otp);

    sendResponse(res, {
      success: true,
      message: 'OTP verified successfully',
      statusCode: 200,
      data: result,
    });
  }
);

// const SignUp = catchAsync(async (req: Request, res: Response) => {
//   const data = req.body;
//   const result = await AuthService.signUp(data);
  

//   const cookieOptions = {
//     secure: config.env === 'production',
//     httpOnly: true,
//   };

//   if (result) {
//     res.cookie(tokenName, result?.accessToken, cookieOptions);
//     // eslint-disable-next-line no-unused-vars
//     const { password, ...userData } = result.data;

//     sendResponse<Partial<User>>(res, {
//       statusCode: httpStatus.CREATED,
//       success: true,
//       message: 'Successfully SignUp',
//       data: userData,
//     });
//   }
// });

const login = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;

  // console.log(loginData,"asdfsd");

  const result = await AuthService.authLoginDB(loginData);

  const { refreshToken, ...others } = result;

  const cookieOption = {
    secure: config.env === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOption);

  res.json({
    success: true,
    statusCode: 200,
    message: 'User sign In successfully!',
    data: others,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const authUser = req.user as any;
  const passData = req.body;
  const result = await AuthService.changePasswordDB(authUser, passData);

  sendResponse<Partial<User>>(res, {
    statusCode: httpStatus.OK,
    message: 'Updated your password',
    success: true,
    data: result,
  });
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const passData = req.body;
  await AuthService.forgotPasswordOTP_DB(passData);

  sendResponse<Partial<User>>(res, {
    statusCode: httpStatus.OK,
    message: 'Check your email',
    success: true,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const passData = req.body;
  const token = req.headers.authorization || 'token';
  await AuthService.resetPassword(passData, token);

  sendResponse<Partial<User>>(res, {
    statusCode: httpStatus.OK,
    message: 'Account recovered ',
    success: true,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const result = await AuthService.refreshToken(refreshToken);

  // set refresh token into cookie

  // const cookieOptions = {
  //   secure: config.env === 'production',
  //   httpOnly: true,
  // };

  // res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<any>(res, {
    statusCode: 200,
    success: true,
    message: 'User logged in successfully !',
    data: result,
  });
});

export const resendOtp = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  const result = await AuthService.resendOtpDB(email);

  sendResponse(res, {
    success: true,
    message: 'OTP resent successfully',
    statusCode: httpStatus.OK,
    data: result,
  });
});

export const AuthController = {
  signUpUser,
  verifySignUpOtp,
  login,
  changePassword,
  forgotPassword,
  resetPassword,
  refreshToken,
  resendOtp,
};
