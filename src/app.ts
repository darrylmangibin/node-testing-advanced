import express, { Express, RequestHandler } from 'express';
import 'colors';
import 'dotenv/config';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';

import connectDatabase from '@utils/database/connect.database';

class App {
  public app: Express = express();

  constructor(private port: number, routes: AppRoutes[]) {
    this.initializeMiddleware(cors(), helmet(), compression(), morgan('dev'));
    this.initializeRoutes(routes);
  }

  public listen() {
    this.app.listen(this.port, async () => {
      await this.initializeDatabaseConnection();

      console.log(`Server running in ${process.env.NODE_ENV} at ${this.port}`.green.bold);
    });
  }

  private initializeDatabaseConnection = async () => {
    await connectDatabase('MongoDB connected...');
  };

  private initializeMiddleware(...handlers: RequestHandler[]) {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));

    handlers.forEach(handler => {
      this.app.use(handler);
    });
  }

  private initializeRoutes(routes: AppRoutes[]) {
    routes.forEach(route => {
      this.app.use(`/api/${route.path}`, route.router);
    });
  }
}

export default App;
