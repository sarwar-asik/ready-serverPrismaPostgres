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
require("colors");
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
const logger_1 = require("./shared/logger");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const server = app_1.default.listen(config_1.default.port, () => {
            console.log(`Server running on port http://localhost:${config_1.default.port}`.green.underline
                .bold);
        });
        const exitHandler = (error) => {
            if (server) {
                server.close(() => {
                    if (error) {
                        logError(error);
                    }
                    process.exit(1);
                });
            }
            else {
                process.exit(1);
            }
        };
        const logError = (error) => {
            if (config_1.default.env === 'production') {
                logger_1.errorlogger.error(error);
            }
            else {
                console.error('Error:', error);
            }
        };
        const unexpectedErrorHandler = (error) => {
            console.error('Unexpected error detected:', error);
            logError(error);
            exitHandler(error);
        };
        process.on('uncaughtException', unexpectedErrorHandler);
        process.on('unhandledRejection', unexpectedErrorHandler);
        process.on('SIGTERM', () => {
            console.log('SIGTERM received');
            if (server) {
                server.close();
            }
        });
    });
}
main();
