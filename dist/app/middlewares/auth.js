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
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const jwtHelpers_1 = require("../../helpers/jwtHelpers");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const auth = (...requiredRoles) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //get authorization token
        const tokenWithBearer = req.headers.authorization;
        console.log(req.headers, 'token');
        if (!tokenWithBearer) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized');
        }
        // verify token
        if (tokenWithBearer && tokenWithBearer.startsWith('Bearer')) {
            const token = tokenWithBearer.split(' ')[1];
            let verifiedUser = null;
            verifiedUser = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
            req.user = verifiedUser; // role  , userid
            // role diye guard korar jnno
            if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
                throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Forbidden');
            }
            const existUser = yield prisma_1.default.user.findUnique({
                where: {
                    id: verifiedUser.id,
                },
            });
            if (!existUser) {
                throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
            }
            if (!existUser.is_active) {
                throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User is not active');
            }
            if (!existUser.is_verified) {
                throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User is not verified');
            }
            const changeTime = existUser === null || existUser === void 0 ? void 0 : existUser.pass_changed_at;
            const iatTime = verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.iat;
            console.log(changeTime, 'changeTime');
            console.log(iatTime, 'iatTime');
            if (changeTime && iatTime) {
                // Convert changeTime to a UNIX timestamp
                const changeTimeUnix = Math.floor(new Date(changeTime).getTime() / 1000); // Convert to seconds
                console.log(changeTimeUnix, 'changeTimeUnix');
                if (changeTimeUnix > iatTime) {
                    throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Password changed after login');
                }
            }
        }
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.default = auth;
