import authMiddleware from '@middleware/auth.middleware';
import { Router } from 'express';
import CommentController from './comment.controller';

class CommentRoutes implements AppRoutes {
  public path = 'comments';
  public router = Router({
    mergeParams: true,
  });

  private commentController = new CommentController();

  constructor() {
    this.registerRoutes();
  }

  public registerRoutes() {
    this.router.use(authMiddleware, this.commentController.findComments);

    this.router.route('/').get();
  }
}

export default CommentRoutes;
