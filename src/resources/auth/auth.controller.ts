import signToken from '@src/utils/token/sign.token';
import { NextFunction, Request, Response } from 'express';
import { UserRequestHandler } from '../user/user.interface';
import UserService from '../user/user.service';
import AuthService from './auth.service';

class AuthController {
  private userService = new UserService();
  private authService = new AuthService();

  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.create(req.body);

      const token = signToken({ id: user.id });

      res.status(201).json({ token });
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.authService.login(req.body);

      const token = signToken({ id: user.id });

      res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  };

  public getProfile: UserRequestHandler = async (req, res, next) => {
    try {
      const user = await this.userService.findUserById(req.user.id, req.query.populate);

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  public testAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json({
        reqUser: req.user,
        globalAuthUser: AuthUser,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
