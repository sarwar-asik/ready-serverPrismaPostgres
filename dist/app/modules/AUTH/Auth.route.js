"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const http_status_1 = __importDefault(require("http-status"));
const user_1 = require("../../../enums/user");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const upload_helper_1 = require("../../../helpers/upload.helper");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const fileUploader_1 = require("../../middlewares/fileUploader");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const Auth_controller_1 = require("./Auth.controller");
const Auth_validation_1 = require("./Auth.validation");
const router = (0, express_1.Router)();
router.post('/sign-up', (0, validateRequest_1.default)(Auth_validation_1.AuthValidation.signUp), Auth_controller_1.AuthController.signUpUser);
router.post('/sign-up-form', fileUploader_1.uploadFile.single('profile_img'), (req, res, next) => {
    var _a;
    if (!((_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.data)) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Data is required');
    }
    else {
        req.body = Auth_validation_1.AuthValidation.signupData.parse(JSON.parse(req.body.data));
    }
    if (!(req === null || req === void 0 ? void 0 : req.file)) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Image is required');
    }
    else {
        (0, upload_helper_1.uploadLocalFileURL)(req, 'single', 'profile_img');
    }
    return Auth_controller_1.AuthController.signUpUser(req, res, next);
});
router.post('/verify-signup-otp', (0, validateRequest_1.default)(Auth_validation_1.AuthValidation.verifySignUpOtp), Auth_controller_1.AuthController.verifySignUpOtp);
router.post('/resend-otp', (0, validateRequest_1.default)(Auth_validation_1.AuthValidation.resendOtp), Auth_controller_1.AuthController.resendOtp);
router.post('/login', (0, validateRequest_1.default)(Auth_validation_1.AuthValidation.loginUser), Auth_controller_1.AuthController.login);
router.patch('/change-password', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.USER), (0, validateRequest_1.default)(Auth_validation_1.AuthValidation.changePassword), Auth_controller_1.AuthController.changePassword);
router.post('/forgot-password', (0, validateRequest_1.default)(Auth_validation_1.AuthValidation.forgotPassword), Auth_controller_1.AuthController.forgotPassword);
router.post('/reset-password', (0, validateRequest_1.default)(Auth_validation_1.AuthValidation.resetPassword), Auth_controller_1.AuthController.resetPassword);
router.post('/refresh-token', (0, validateRequest_1.default)(Auth_validation_1.AuthValidation.refreshTokenZodSchema), Auth_controller_1.AuthController.refreshToken);
exports.authRoutes = router;
