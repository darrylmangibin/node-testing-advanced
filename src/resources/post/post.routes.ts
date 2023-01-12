import authMiddleware from '@src/middleware/auth.middleware';
import validationMiddleware from '@src/middleware/validation.middleware';
import { Router } from 'express';
import PostController from './post.controller';
import { postCreateOrUpdateValidaiton } from './post.validation';

class PostRoutes implements AppRoutes {
  public path = 'posts';
  public router = Router();

  private postController = new PostController();

  constructor() {
    this.registerRoutes();
  }

  public registerRoutes() {
    this.router.use(authMiddleware);

    this.router
      .route('/')
      .get(this.postController.findPosts)
      .post(
        validationMiddleware(postCreateOrUpdateValidaiton),
        this.postController.createPost
      );

    this.router.route('/:postId').get(this.postController.findPostById);
  }
}

export default PostRoutes;
