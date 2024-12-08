import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import router from './app/routes';
import config from './config';
import { compressionOptions, limiterRate } from './config/express.middleware';
import { LogsRoutes } from './app/modules/logs/logs.rotes';

const app: Application = express();

app.use(
  cors({
    origin:
      config.env === 'development'
        ? [
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'http://192.168.0.101:3000',
          ]
        : ['*'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  })
);

//parser
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(compression(compressionOptions));
app.use(limiterRate);


app.use('/api/v1', router);

app.use("/logs", LogsRoutes);

// strict mode on path

//global error handler
app.get('/', async (req: Request, res: Response) => {
  const resData :any= {
    success: true,
    message: `Running the ${config.server_name} server`,
    statusCode: 201,
    data: null,
    serverUrl: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
  }
  if(config.env === 'development'){
    resData.logs = `${req.protocol}://${req.get('host')}${req.originalUrl}logs/errors`;
  }
  res.json(resData);
  // next();
});

//handle not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
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



app.use(globalErrorHandler);

export default app;
