import authMiddleware from '@src/middleware/auth.middleware';
import { Router } from 'express';
import PostController from './post.controller';

class PostRoutes implements AppRoutes {
  public path = 'posts';
  public router = Router();

  private postController = new PostController();

  constructor() {
    this.registerRoutes();
  }

  public registerRoutes() {
    this.router.use(authMiddleware);

    this.router.route('/').get(this.postController.findPosts);
  }
}

export default PostRoutes;
