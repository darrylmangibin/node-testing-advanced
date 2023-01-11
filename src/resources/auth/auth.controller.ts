import signToken from '@src/utils/token/sign.token';
import { NextFunction, Request, Response } from 'express';
import UserService from '../user/user.service';

class AuthController {
  private userService = new UserService();

  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.create(req.body);

      const token = signToken({ id: user.id });

      res.status(201).json({ token });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
