import path from 'path';
import swaggerJsdoc from 'swagger-jsdoc';
import config from '../config';
import { swaggerDefinition, swaggerTags } from './swagger.utils';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: `${config.server_name} Backend`,
      version: '1.0.0',
      description: `Api Design of ${config.server_name}`,
      contact: {
        name: 'Sarwar Hossain',
        email: 'sarwarasik@gmail.com',
        url: 'https://www.linkedin.com/in/sarwar-asik/',
      },
      license: {
        name: 'SparkTech',
        url: 'https://sparktech.agency/',
      },
    },
    servers: [
      {
        url: "http://localhost:5003",
      },
      {
        url: "http://54.157.71.177:5003",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: swaggerDefinition,
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: swaggerTags,
  },
  // apis: [path.join(__dirname, '../app/modules/**/*.ts')],
  // apis: [path.join(__dirname, '../app/modules/**/*.ts'),path.join(__dirname, '../../dist/app/modules/**/*.js')],
  
  apis: [
    path.join(__dirname, '../**/*.ts'),
    path.join(__dirname, '../**/*.js'),
    path.join(__dirname, '../../dist/app/modules/**/*.ts'),
    path.join(__dirname, '../../dist/app/modules/**/*.js')
  ],

};


// ! swagger UI customization sections
export const swaggerUiOptions = {
  customSiteTitle: `${config.server_name} API Docs`,
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
      content: '${config.server_name} Api Design';
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


export const swaggerApiSpecification = swaggerJsdoc(options);


