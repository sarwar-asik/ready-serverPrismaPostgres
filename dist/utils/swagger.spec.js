"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerApiSpecification = exports.swaggerUiOptions = void 0;
const path_1 = __importDefault(require("path"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const config_1 = __importDefault(require("../config"));
const swagger_utils_1 = require("./swagger.utils");
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: ` ${config_1.default.server_name} Backend`,
            version: '1.0.0',
            description: `Api Design of  ${config_1.default.server_name}`,
            contact: {
                name: "Sarwar Hossain [Spark Tech Agency]",
                email: "sarwarasik@gmail.com",
                url: "https://www.linkedin.com/in/sarwar-asik/"
            },
            license: {
                name: 'STA',
                url: 'https://sparktech.agency/',
            },
        },
        // !component part
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: swagger_utils_1.swaggerDefinition,
            response: {
                description: 'Access token is missing or invalid',
                content: {
                    'application/json': {
                        example: { message: 'Unauthorized' },
                    },
                },
            }
        },
        // !security part
        security: [
            {
                bearerAuth: [],
            },
        ],
        // !tags part
        tags: swagger_utils_1.swaggerTags,
    },
    apis: [
        path_1.default.join(__dirname, '../app/modules/**/*.ts'),
    ],
};
// ! swagger UI customization sections
exports.swaggerUiOptions = {
    customSiteTitle: `${config_1.default.server_name} API Docs`,
    // customfavIcon: '/uploadFile/images/default/fitness-fav.png',
    customCss: `
      .swagger-ui .topbar { 
          //  display: none !important;
      background-color: #2c3e50 !important; 
      border-bottom: 2px solid #2980b9;
    }
    .swagger-ui .topbar a span { 
      color: #ecf0f1 !important;
      font-weight: bold;
    }
    .swagger-ui .topbar .topbar-wrapper { 
      // display: none !important; 
    }
    .swagger-ui .topbar .topbar-wrapper::before {
      content: '${config_1.default.server_name} Api Design';
      color: #fff;
      font-size: 18px;
      margin:auto;
      padding:24px;
      text-align: center;
      font-weight: bold;
      text-transform: uppercase;
    }
  `,
    docExpansion: 'none',
    defaultModelsExpandDepth: -1,
    swaggerOptions: {
        docExpansion: 'none', // Collapses the routes by default
        persistAuthorization: true,
    },
};
exports.swaggerApiSpecification = (0, swagger_jsdoc_1.default)(options);
