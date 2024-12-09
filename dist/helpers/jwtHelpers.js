"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtHelpers = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const createToken = (payload, secret, expireTime) => {
    // console.log(expireTime, 'expireTime'); // Log the expireTime to verify
    return jsonwebtoken_1.default.sign(payload, secret, {
        expiresIn: expireTime,
    });
};
const verifyToken = (token, secret) => {
    return jsonwebtoken_1.default.verify(token, secret);
};
const createPassResetToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, config_1.default.jwt.secret, {
        algorithm: 'HS256',
        expiresIn: config_1.default.jwt.expires_in,
    });
};
exports.jwtHelpers = {
    createToken,
    verifyToken,
    createPassResetToken,
};
