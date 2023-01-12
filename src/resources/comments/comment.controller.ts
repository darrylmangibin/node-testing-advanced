import optionsPaginate from '@src/utils/paginate/options.paginate';
import { RequestHandler } from 'express';
import { FilterQuery } from 'mongoose';
import { CommentData } from './comment.interface';
import CommentService from './comment.service';

class CommentController {
  private commentService = new CommentService();

  public findComments: RequestHandler = async (req, res, next) => {
    try {
      let query = {
        ...(req.query.filter as unknown as FilterQuery<CommentData>),
      } satisfies FilterQuery<CommentData>;

      if (req.params.postId) {
        query = { ...query, post: req.params.postId };
      }

      const options = optionsPaginate(req.query);

      console.log(options);

      const results = await this.commentService.findComments(query, options);

      res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  };
}

export default CommentController;
