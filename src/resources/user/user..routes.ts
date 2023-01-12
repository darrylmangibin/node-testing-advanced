import authMiddleware from '@src/middleware/auth.middleware';
import { Router } from 'express';
import UserController from './user.controller';

class UserRoutes implements AppRoutes {
  public path = 'users';
  public router = Router();

  private userController = new UserController();

  constructor() {
    this.registerRoutes();
  }

  public registerRoutes() {
    this.router.use(authMiddleware);

    this.router.route('/').get(this.userController.findUsers);

    this.router.route('/:userId').get(this.userController.findUserById);
  }
}

export default UserRoutes;
