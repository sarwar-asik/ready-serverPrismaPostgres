"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const config_1 = __importDefault(require("../../../config"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const otp_template_1 = require("../../../helpers/mail/otp-template");
const sendMail_1 = require("../../../helpers/mail/sendMail");
const sendMailer_1 = require("../../../helpers/sendMailer");
const Auth_helper_1 = require("./Auth.helper");
const resetPassword_1 = require("./resetPassword");
const signUpUserDB = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistUser = yield prisma_1.default.user.findUnique({
        where: {
            email: userData.email
        }
    });
    if (isExistUser) {
        if (!(isExistUser === null || isExistUser === void 0 ? void 0 : isExistUser.is_active)) {
            throw new ApiError_1.default(http_status_1.default.CONFLICT, "User is not active");
        }
        if (!(isExistUser === null || isExistUser === void 0 ? void 0 : isExistUser.is_verified)) {
            throw new ApiError_1.default(http_status_1.default.CONFLICT, "User is not verified");
        }
        throw new ApiError_1.default(http_status_1.default.CONFLICT, "User already exist");
    }
    const activationOTP = (0, Auth_helper_1.createActivationCode)();
    const sendOtpMail = yield (0, sendMail_1.sendEmailFunc)({
        email: userData === null || userData === void 0 ? void 0 : userData.email,
        subject: 'Activate your Account',
        html: (0, otp_template_1.registrationSuccessEmailBody)({
            name: userData === null || userData === void 0 ? void 0 : userData.email,
            activationCode: activationOTP,
        }),
    });
    console.log(sendOtpMail, 'sendOtpMail');
    const expiryTime = new Date(Date.now() + 15 * 60 * 1000);
    const hashedOTP = yield bcrypt_1.default.hash(activationOTP, Number(5));
    userData.verify_code = hashedOTP;
    userData.verify_expiration = expiryTime;
    userData.password = yield bcrypt_1.default.hash(userData.password, Number(config_1.default.bycrypt_salt_rounds));
    const createUser = yield prisma_1.default.user.create({
        data: userData,
    });
    return {
        email: createUser === null || createUser === void 0 ? void 0 : createUser.email,
        id: createUser === null || createUser === void 0 ? void 0 : createUser.id,
        role: createUser === null || createUser === void 0 ? void 0 : createUser.role,
    };
});
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
const verifySignUpOtpDB = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const isValidOTP = yield (0, Auth_helper_1.checkIsValidOTP)({ email, code: otp });
    if (!isValidOTP.valid) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'OTP not found or already used');
    }
    yield prisma_1.default.user.update({
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
});
const authLoginDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    // console.log(payload, 'payload');
    // const isUserExist = await User.isUserExistsMethod(phoneNumber);
    // // console.log(isUserExist,"isUserExits");
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: {
            email,
        },
    });
    // console.log(isUserExist);
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    else {
        if (!(isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.is_active)) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User is not active');
        }
        if (!(isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.is_verified)) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User is not verified');
        }
    }
    const isPasswordMatch = yield bcrypt_1.default.compare(password, isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.password);
    if (isUserExist.password && !isPasswordMatch) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Password is not correct');
    }
    //   jwt part ///
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({
        email,
        role: isUserExist.role,
        id: isUserExist.id,
        user_name: isUserExist.user_name,
    }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({
        email,
        role: isUserExist.role,
        id: isUserExist.id,
        user_name: isUserExist.user_name,
    }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return {
        accessToken,
        refreshToken,
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    //verify token
    // invalid token - synchronous
    let verifiedToken = null;
    try {
        verifiedToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.refresh_secret);
    }
    catch (err) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Invalid Refresh Token');
    }
    const { id } = verifiedToken;
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: {
            id: id,
        },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    //generate new token
    const newAccessToken = jwtHelpers_1.jwtHelpers.createToken({
        id: isUserExist.id,
        role: isUserExist.role,
    }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    return {
        accessToken: newAccessToken,
    };
});
const resendOtpDB = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistUser = yield prisma_1.default.user.findUnique({
        where: {
            email,
        },
    });
    if (!isExistUser) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    const activationOTP = (0, Auth_helper_1.createActivationCode)();
    yield (0, sendMail_1.sendEmailFunc)({
        email: email,
        subject: 'Activate your Account',
        html: (0, otp_template_1.registrationSuccessEmailBody)({
            name: email,
            activationCode: activationOTP,
        }),
    });
    // console.log(sendOtpMail, 'sendOtpMail');
    const expiryTime = new Date(Date.now() + 15 * 60 * 1000);
    const hashedOTP = yield bcrypt_1.default.hash(activationOTP, Number(5));
    yield prisma_1.default.user.update({
        where: {
            email,
        },
        data: {
            verify_code: hashedOTP,
            verify_expiration: expiryTime,
        },
    });
    return { email };
});
const changePasswordDB = (authUser, passwordData) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = authUser;
    // console.log(authUser);
    const { oldPassword, newPassword } = passwordData;
    const password = yield bcrypt_1.default.hash(newPassword, Number(config_1.default.bycrypt_salt_rounds));
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: {
            id,
        },
    });
    // console.log(isUserExist);
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not match');
    }
    const isPasswordMatch = yield bcrypt_1.default.compare(oldPassword, isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.password);
    if (isUserExist.password && !isPasswordMatch) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Old Password is not correct');
    }
    const updatePass = yield prisma_1.default.user.update({
        where: {
            id,
        },
        data: {
            password,
            pass_changed_at: new Date(),
        },
    });
    return updatePass;
});
const forgotPasswordLink = (passwordData) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('🚀passwordData:', passwordData);
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: {
            email: passwordData.email,
        },
    });
    // console.log(isUserExist);
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User NOt Found');
    }
    const passResetToken = yield jwtHelpers_1.jwtHelpers.createPassResetToken({
        id: isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.id,
        email: isUserExist.email,
    });
    const resetLink = config_1.default.frontend_url +
        '/resetPassword?' +
        `id=${isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.id}&token=${passResetToken}`;
    // console.log(passResetToken, '');
    yield (0, sendMailer_1.senMailer)(resetPassword_1.resetPasswordSubject, isUserExist.email, (0, resetPassword_1.resetPasswordHTML)(resetLink));
    return passResetToken;
});
const forgotPasswordOTP_DB = (passwordData) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: {
            email: passwordData.email,
            is_active: true,
            is_verified: true
        },
    });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User NOt Found');
    }
    const activationOTP = (0, Auth_helper_1.createActivationCode)();
    yield (0, sendMail_1.sendEmailFunc)({
        email: user === null || user === void 0 ? void 0 : user.email,
        subject: 'Reset Password',
        html: (0, otp_template_1.registrationSuccessEmailBody)({
            name: user === null || user === void 0 ? void 0 : user.email,
            activationCode: activationOTP,
        }),
    });
    const expiryTime = new Date(Date.now() + 15 * 60 * 1000);
    const hashedOTP = yield bcrypt_1.default.hash(activationOTP, Number(5));
    yield prisma_1.default.user.update({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
        },
        data: {
            verify_code: hashedOTP,
            verify_expiration: expiryTime,
        },
    });
});
const resetPassword = (passwordData, token) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(passwordData, token);
    const newPassword = yield bcrypt_1.default.hash(passwordData.newPassword, Number(config_1.default.bycrypt_salt_rounds));
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: {
            email: passwordData === null || passwordData === void 0 ? void 0 : passwordData.email,
        },
    });
    console.log(isUserExist);
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User NOt Found');
    }
    const isVerified = yield jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
    if (!isVerified) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'token is expired');
    }
    const updatePass = yield prisma_1.default.user.update({
        where: {
            email: isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.email,
        },
        data: {
            password: newPassword,
        },
    });
    return updatePass;
});
exports.AuthService = {
    signUpUserDB,
    authLoginDB,
    changePasswordDB,
    forgotPasswordOTP_DB,
    forgotPasswordLink,
    resetPassword,
    refreshToken,
    verifySignUpOtpDB,
    resendOtpDB,
};
