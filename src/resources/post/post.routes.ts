import authMiddleware from '@src/middleware/auth.middleware';
import validationMiddleware from '@src/middleware/validation.middleware';
import { Router } from 'express';
import PostController from './post.controller';
import { postCreateOrUpdateValidaiton } from './post.validation';
import CommentRoutes from '../comments/comment.routes';

class PostRoutes implements AppRoutes {
  public path = 'posts';
  public router = Router({
    mergeParams: true,
  });

  private postController = new PostController();

  constructor() {
    this.registerRoutes();
  }

  public registerRoutes() {
    this.router.use('/:postId/comments', new CommentRoutes().router);

    this.router.use(authMiddleware);

    this.router
      .route('/')
      .get(this.postController.findPosts)
      .post(
        validationMiddleware(postCreateOrUpdateValidaiton),
        this.postController.createPost
      );

    this.router
      .route('/:postId')
      .get(this.postController.findPostById)
      .put(
        validationMiddleware(postCreateOrUpdateValidaiton),
        this.postController.findPostAndUpdate
      )
      .delete(this.postController.findPostAndDelete);
  }
}

export default PostRoutes;
