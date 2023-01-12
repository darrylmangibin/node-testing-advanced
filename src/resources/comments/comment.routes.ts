import authMiddleware from '@middleware/auth.middleware';
import validationMiddleware from '@src/middleware/validation.middleware';
import { Router } from 'express';
import CommentController from './comment.controller';
import { commentCreateOrUpdateValidation } from './comment.validation';

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
    this.router.use(authMiddleware);

    this.router
      .route('/')
      .get(this.commentController.findComments)
      .post(
        validationMiddleware(commentCreateOrUpdateValidation),
        this.commentController.createComment
      );

    this.router.route('/:commentId').get(this.commentController.findCommentById);
  }
}

export default CommentRoutes;
