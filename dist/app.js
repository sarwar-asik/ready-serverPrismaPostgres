"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_status_1 = __importDefault(require("http-status"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = __importDefault(require("./app/routes"));
const config_1 = __importDefault(require("./config"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: config_1.default.env === 'development'
        ? [
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'http://192.168.0.101:3000',
        ]
        : [''],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));
app.use((0, cookie_parser_1.default)());
//parser
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api/v1', routes_1.default);
//global error handler
app.use(globalErrorHandler_1.default);
//handle not found
app.use((req, res, next) => {
    res.status(http_status_1.default.NOT_FOUND).json({
        success: false,
        message: 'Not Found',
        errorMessages: [
            {
                path: req.originalUrl,
                message: 'API Not Found',
            },
        ],
    });
    next();
});
app.use('/', (req, res) => {
    // console.log(req?.body,"https//:localhost:5000");
    res.json({
        status: http_status_1.default.OK,
        message: `sarwar-server  is running on http://localhost:${config_1.default.port}`,
    });
});
exports.default = app;
