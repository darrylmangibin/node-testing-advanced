import adminMiddleware from '@src/middleware/admin.middleware';
import authMiddleware from '@src/middleware/auth.middleware';
import validationMiddleware from '@src/middleware/validation.middleware';
import { Router } from 'express';
import UserController from './user.controller';
import { userUpdateValidation } from './user.validation';
import PostRoutes from '../post/post.routes';

class UserRoutes implements AppRoutes {
  public path = 'users';
  public router = Router();

  private userController = new UserController();

  constructor() {
    this.registerRoutes();
  }

  public registerRoutes() {
    this.router.use('/:userId/posts', new PostRoutes().router);

    this.router.use(authMiddleware);

    this.router.route('/').get(this.userController.findUsers);

    this.router
      .route('/:userId')
      .get(this.userController.findUserById)
      .put(
        adminMiddleware,
        validationMiddleware(userUpdateValidation),
        this.userController.findUserAndUpdate
      )
      .delete(adminMiddleware, this.userController.findUserAndDelete);
  }
}

export default UserRoutes;
