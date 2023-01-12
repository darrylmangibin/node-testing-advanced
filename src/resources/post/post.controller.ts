import ErrorException from '@src/utils/exceptions/error.exception';
import notfoundException from '@src/utils/exceptions/notfound.exception';
import optionsPaginate from '@src/utils/paginate/options.paginate';
import { NextFunction, Request, Response } from 'express';
import { FilterQuery } from 'mongoose';
import { PostData, PostDocument } from './post.interface';
import PostService from './post.service';

class PostController {
  private postService = new PostService();

  public findPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let query = {
        ...(req.query.filter as unknown as FilterQuery<PostData>),
      } satisfies FilterQuery<PostData>;

      const options = optionsPaginate(req.query);

      const results = await this.postService.findPosts(query, options);

      res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  };

  public findPostById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const post = await this.postService.findPostById(req.params.postId);

      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  };

  public createPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const post = await this.postService.createPost({
        ...req.body,
        user: req.user.id,
      });

      res.status(201).json(post);
    } catch (error) {
      next(error);
    }
  };

  public findPostAndUpdate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const post = await this.postService.findPostById(req.params.postId);

      if (!post) {
        return notfoundException('Post not found');
      }

      this.checkPostOwner(post, req.user.id);

      const updatedPost = await this.postService.findPostAndUpdate(
        req.params.postId,
        req.body
      );

      res.status(200).json(updatedPost);
    } catch (error) {
      next(error);
    }
  };

  private checkPostOwner(post: PostDocument, userId: string) {
    if (post.user.toString() !== userId) {
      throw new ErrorException('Forbidden. Not allowed to perform this action', 403);
    }
  }
}

export default PostController;
