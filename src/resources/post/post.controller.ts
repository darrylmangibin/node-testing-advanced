import optionsPaginate from '@src/utils/paginate/options.paginate';
import { NextFunction, Request, Response } from 'express';
import { FilterQuery } from 'mongoose';
import { PostData } from './post.interface';
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
}

export default PostController;
