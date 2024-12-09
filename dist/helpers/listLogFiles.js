"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listLogFiles = void 0;
/* eslint-disable no-undef */
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Helper function to list log files
const listLogFiles = (logType) => {
    const logDir = path_1.default.join(process.cwd(), "logs", "winston", logType);
    try {
        return fs_1.default.readdirSync(logDir).filter((file) => file.endsWith(".log"));
    }
    catch (err) {
        // eslint-disable-next-line no-console
        console.error(`Failed to list ${logType} logs: `, err);
        return [];
    }
};
exports.listLogFiles = listLogFiles;
