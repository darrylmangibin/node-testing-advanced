import { UserData, UserDocument } from "@src/resources/user/user.interface";
import { Router } from "express";
import { JwtPayload } from "jsonwebtoken";

declare module 'definitions';

declare global {
  interface AppRoutes {
    public path: string;
    public router: Router;
    public registerRoutes: function(): void;
  }

  interface AppTimestamps {
    createdAt: Date;
    updatedAt: Date;
  }

  interface AppPayload extends JwtPayload {
    id: string
  }

  var signedIn: (data?: Partial<UserData>) => Promise<{ user: UserDocument, token: string }>
}

export {}