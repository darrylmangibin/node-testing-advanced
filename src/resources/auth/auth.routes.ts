import adminMiddleware from '@src/middleware/admin.middleware';
import authMiddleware from '@src/middleware/auth.middleware';
import validationMiddleware from '@src/middleware/validation.middleware';
import { Router } from 'express';
import AuthController from './auth.controller';
import {
  authLoginValidation,
  authRegisterValidation,
  authUpdatePasswordValidation,
} from './auth.validation';

class AuthRoutes implements AppRoutes {
  public path = 'auth';
  public router = Router();

  private authController = new AuthController();

  constructor() {
    this.registerRoutes();
  }

  public registerRoutes = () => {
    this.router.post(
      '/register',
      validationMiddleware(authRegisterValidation),
      this.authController.register
    );

    this.router.post(
      '/login',
      validationMiddleware(authLoginValidation),
      this.authController.login
    );

    this.router
      .route('/profile')
      .get(authMiddleware, this.authController.getProfile)
      .put(authMiddleware, this.authController.updateProfile)
      .delete(authMiddleware, this.authController.deleteProfile);

    this.router.put(
      '/update-password',
      authMiddleware,
      validationMiddleware(authUpdatePasswordValidation),
      this.authController.updatePassword
    );

    this.router.get('/posts', authMiddleware, this.authController.getPosts);

    this.router.get(
      '/test-middleware',
      authMiddleware,
      adminMiddleware,
      this.authController.testAuthMiddleware
    );
  };
}

export default AuthRoutes;
