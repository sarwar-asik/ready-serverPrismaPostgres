"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const logs_controller_1 = require("./logs.controller");
const router = express_1.default.Router();
// All Errors
router.get("/errors", logs_controller_1.logsController.getAllErrorLogs);
// All Successes
router.get("/successes", logs_controller_1.logsController.getAllSuccessLogs);
// Specific Error
router.get("/errors/:logfile", logs_controller_1.logsController.getSpecificErrorLog);
// Specific Success
router.get("/successes/:logfile", logs_controller_1.logsController.getSpecificSuccessLog);
exports.LogsRoutes = router;
