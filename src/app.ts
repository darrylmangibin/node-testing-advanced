import express, { Express } from 'express';
import 'colors';
import 'dotenv/config';

class App {
  public app: Express = express();

  constructor(private port: number, routes: AppRoutes[]) {}

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`Server running in ${process.env.NODE_ENV} at ${this.port}`.green.bold);
    });
  }
}

export default App;
