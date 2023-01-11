import { UserDocument } from '@src/resources/user/user.interface';
import User from '@src/resources/user/user.model';
import ErrorException from '@src/utils/exceptions/error.exception';
import verifyToken, { isAppPayload } from '@src/utils/token/verify.token';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';

const isTokenString = (token: unknown): token is string => typeof token === 'string';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token: unknown;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ').at(1);
    }

    if (!token) {
      throw new ErrorException('Unauthorized. No token', 401);
    }

    if (isTokenString(token)) {
      let decoded: unknown;
      try {
        decoded = await verifyToken(token);
      } catch (error) {
        throw new ErrorException('Unauthorized. Token error', 401);
      }

      let user: UserDocument | null = null;

      if (isAppPayload(decoded)) {
        user = await User.findById(decoded.id);
      }

      if (!user) {
        throw new ErrorException('Unauthorized. No user', 401);
      }

      req.user = user;
      global.AuthUser = user;

      next();
    } else {
      throw new ErrorException('Unauthorized. Invalid token type', 401);
    }
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;
