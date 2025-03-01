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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = exports.resendOtp = exports.verifySignUpOtp = exports.signUpUser = void 0;
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const Auth_service_1 = require("./Auth.service");
exports.signUpUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = __rest(req.body, []);
    // console.log(user, 'from controller=================');
    const result = yield Auth_service_1.AuthService.signUpUserDB(user);
    if (result) {
        (0, sendResponse_1.default)(res, {
            success: true,
            message: "sent OTP. Please, verify your email/finger",
            statusCode: 200,
            data: result,
        });
    }
}));
exports.verifySignUpOtp = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    const result = yield Auth_service_1.AuthService.verifySignUpOtpDB(email, otp);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: 'OTP verified successfully',
        statusCode: 200,
        data: result,
    });
}));
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
const login = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginData = __rest(req.body, []);
    // console.log(loginData,"asdfsd");
    const result = yield Auth_service_1.AuthService.authLoginDB(loginData);
    const { refreshToken } = result, others = __rest(result, ["refreshToken"]);
    const cookieOption = {
        secure: config_1.default.env === 'production',
        httpOnly: true,
    };
    res.cookie('refreshToken', refreshToken, cookieOption);
    res.json({
        success: true,
        statusCode: 200,
        message: 'User sign In successfully!',
        data: others,
    });
}));
const changePassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authUser = req.user;
    const passData = req.body;
    const result = yield Auth_service_1.AuthService.changePasswordDB(authUser, passData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Updated your password',
        success: true,
        data: result,
    });
}));
const forgotPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const passData = req.body;
    yield Auth_service_1.AuthService.forgotPasswordOTP_DB(passData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Check your email',
        success: true,
    });
}));
const resetPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const passData = req.body;
    const token = req.headers.authorization || 'token';
    yield Auth_service_1.AuthService.resetPassword(passData, token);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Account recovered ',
        success: true,
    });
}));
const refreshToken = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.cookies;
    const result = yield Auth_service_1.AuthService.refreshToken(refreshToken);
    // set refresh token into cookie
    // const cookieOptions = {
    //   secure: config.env === 'production',
    //   httpOnly: true,
    // };
    // res.cookie('refreshToken', refreshToken, cookieOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'User logged in successfully !',
        data: result,
    });
}));
exports.resendOtp = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const result = yield Auth_service_1.AuthService.resendOtpDB(email);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: 'OTP resent successfully',
        statusCode: http_status_1.default.OK,
        data: result,
    });
}));
exports.AuthController = {
    signUpUser: exports.signUpUser,
    verifySignUpOtp: exports.verifySignUpOtp,
    login,
    changePassword,
    forgotPassword,
    resetPassword,
    refreshToken,
    resendOtp: exports.resendOtp,
};
