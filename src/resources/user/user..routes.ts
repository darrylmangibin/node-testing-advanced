import { Router } from 'express';

class UserRoutes implements AppRoutes {
  public path = 'users';
  public router = Router();

  constructor() {
    this.registerRoutes();
  }

  public registerRoutes() {
    this.router.route('/');
  }
}

export default UserRoutes;
