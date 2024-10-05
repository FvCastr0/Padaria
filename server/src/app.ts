import cors from 'cors';
import express, { Express } from 'express';
import { dayRouter } from './routes/day';
import { saleRouter } from './routes/sale';

class App {
  app: Express;
  constructor() {
    this.app = express();
    this.middleware();
    this.routes();
  }

  middleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors())
  }

  routes() {
    this.app.use('/', dayRouter);
    this.app.use('/', saleRouter);
  }
}

export default new App().app;
