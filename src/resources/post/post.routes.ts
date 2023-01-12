import { Router } from 'express';

class PostRoutes implements AppRoutes {
  public path = 'posts';
  public router = Router();

  constructor() {
    this.registerRoutes();
  }

  public registerRoutes() {
    this.router.route('/');
  }
}

export default PostRoutes;
