import "colors";
import { Server } from 'http';
import app from './app';
import config from './config';
import { errorlogger } from "./shared/logger";


async function main() {

  const server: Server = app.listen(config.port, () => {
    console.log(`Server running on port http://localhost:${config.port}`.green.underline.bold);
  });

  const exitHandler = () => {

    if (server) {
      server.close(() => {
        config.env === 'production'
          ? errorlogger.error(error)
          : console.log(error);
        process.exit(1);
      });
    }
    process.exit(1);
  };

  const unexpectedErrorHandler = (error: unknown) => {
    config.env === 'production'
    ? errorlogger.error(error)
    : console.log('unexpectedErrorHandler is detected ......', error);
    exitHandler();
  };

  process.on('uncaughtException', unexpectedErrorHandler);
  process.on('unhandledRejection', unexpectedErrorHandler);

  process.on('SIGTERM', () => {
    console.log('SIGTERM received');
    if (server) {
      server.close();
    }
  });
}

main();