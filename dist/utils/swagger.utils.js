"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerDefinition = exports.swaggerTags = void 0;
const config_1 = __importDefault(require("../config"));
exports.swaggerTags = [
    {
        name: "User",
        description: "👤 User profile related API"
    },
];
exports.swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: ` ${config_1.default.server_name} Backend`,
        version: "1.0.0",
        description: `Api Design of  ${config_1.default.server_name}`,
        contact: {
            name: "Sarwar Hossain [Spark Tech Agency]",
            email: "sarwarasik@gmail.com",
            url: "https://www.linkedin.com/in/sarwar-asik/",
        },
        license: {
            name: "Bd Calling IT",
            url: "https://sparktech.agency/",
        },
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
    },
};
