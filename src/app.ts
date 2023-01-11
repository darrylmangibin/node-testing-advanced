import express, { Express } from 'express';
import 'colors';
import 'dotenv/config';

import connectDatabase from '@utils/database/connect.database';

class App {
  public app: Express = express();

  constructor(private port: number, routes: AppRoutes[]) {}

  public listen() {
    this.app.listen(this.port, async () => {
      await this.initializeDatabaseConnection();

      console.log(`Server running in ${process.env.NODE_ENV} at ${this.port}`.green.bold);
    });
  }

  private initializeDatabaseConnection = async () => {
    await connectDatabase('MongoDB connected...');
  };
}

export default App;
