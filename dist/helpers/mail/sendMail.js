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
exports.sendEmailFunc = sendEmailFunc;
const nodemailer_1 = __importDefault(require("nodemailer"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
function sendEmailFunc(options) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const transporter = nodemailer_1.default.createTransport({
                host: config_1.default.smtp.host,
                port: parseInt(config_1.default.smtp.port),
                // secure: false,
                auth: {
                    user: config_1.default.smtp.auth.user,
                    pass: config_1.default.smtp.auth.pass,
                },
            });
            yield transporter.sendMail({
                from: config_1.default.smtp.auth.user,
                to: options.email,
                subject: options.subject,
                html: options.html,
            });
        }
        catch (error) {
            // eslint-disable-next-line no-console
            console.log(error);
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Email not sent');
        }
    });
}
