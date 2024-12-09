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
exports.checkIsValidOTP = exports.createActivationCode = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const createActivationCode = () => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    return activationCode;
};
exports.createActivationCode = createActivationCode;
const checkIsValidOTP = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: {
            email: payload === null || payload === void 0 ? void 0 : payload.email,
        },
    });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User does not exist!');
    }
    if (!user.verify_code || !user.verify_expiration) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'OTP not found or already used');
    }
    // console.log(user);
    // console.log(user.verify_expiration, new Date());
    if (new Date(user.verify_expiration).getTime() <= new Date().getTime()) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'OTP has expired');
    }
    const isOTPMatch = yield bcrypt_1.default.compare(payload === null || payload === void 0 ? void 0 : payload.code, user.verify_code);
    if (!isOTPMatch) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'OTP is not correct');
    }
    return { valid: true, user };
});
exports.checkIsValidOTP = checkIsValidOTP;
