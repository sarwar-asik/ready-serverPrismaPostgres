import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import globalErrorHandler from './app/middlewares/globalErrorHandler';

import cookieParser from 'cookie-parser';
import router from './app/routes';
import config from './config';

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
        : [''],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  })
);
app.use(cookieParser());

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1', router);

//global error handler
app.use(globalErrorHandler);

//handle not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
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

app.use('/', (req: Request, res: Response) => {
  // console.log(req?.body,"https//:localhost:5000");
  res.json({
    status: httpStatus.OK,
    message: `sarwar-server  is running on http://localhost:${config.port}`,
  });
});
export default app;
