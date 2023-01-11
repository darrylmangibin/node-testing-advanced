import { Router } from "express";
import { JwtPayload } from "jsonwebtoken";

declare module 'definitions';

declare global {
  abstract class AppRoutes {
    abstract path: string;
    abstract router: Router;
    abstract registerRoutes: function(): void;

    constructor() {
      this.registerRoutes()
    }
  }

  interface AppTimestamps {
    createdAt: Date;
    updatedAt: Date;
  }

  interface AppPayload extends JwtPayload {
    id: string
  }
}

export {}