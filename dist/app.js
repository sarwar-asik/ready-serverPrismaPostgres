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
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_status_1 = __importDefault(require("http-status"));
const path_1 = __importDefault(require("path"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const logs_rotes_1 = require("./app/modules/logs/logs.rotes");
const routes_1 = __importDefault(require("./app/routes"));
const config_1 = __importDefault(require("./config"));
const express_middleware_1 = require("./config/express.middleware");
// import prisma from './shared/prisma';
const swagger_spec_1 = require("./utils/swagger.spec");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: config_1.default.env === 'development'
        ? [
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'http://192.168.0.101:3000',
        ]
        : ['*'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));
//parser
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, compression_1.default)(express_middleware_1.compressionOptions));
app.use(express_middleware_1.limiterRate);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_spec_1.swaggerApiSpecification, swagger_spec_1.swaggerUiOptions));
app.use(express_middleware_1.helmetConfig);
// app.get('/test', (req: Request, res: Response) => {
//   res.json({
//     prisData:prisma
//   });
// });
app.use('/api/v1', routes_1.default);
app.use("/logs", logs_rotes_1.LogsRoutes);
app.use('/uploadFile', express_1.default.static(path_1.default.join(__dirname, '../uploadFile')));
app.get('/api-docs-json', (req, res) => {
    res.json(swagger_spec_1.swaggerApiSpecification);
});
// strict mode on path
//global error handler
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const resData = {
        success: true,
        message: `Running the ${config_1.default.server_name} server`,
        statusCode: 201,
        data: null,
        serverUrl: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
    };
    if (config_1.default.env === 'development') {
        resData.logs = `${req.protocol}://${req.get('host')}${req.originalUrl}logs/errors`;
    }
    res.json(resData);
    // next();
}));
//handle not found
app.use((req, res, next) => {
    res.status(http_status_1.default.NOT_FOUND).json({
        success: false,
        message: 'Not Found the path',
        errorMessages: [
            {
                path: req.originalUrl,
                message: 'API Not Found',
            },
        ],
    });
    next();
});
app.use(globalErrorHandler_1.default);
exports.default = app;
