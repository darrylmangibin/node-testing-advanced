import notfoundException from '@src/utils/exceptions/notfound.exception';
import optionsPaginate from '@src/utils/paginate/options.paginate';
import { RequestHandler } from 'express';
import { FilterQuery, PaginateOptions } from 'mongoose';
import Post from '../post/post.model';
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

  public findCommentById: RequestHandler = async (req, res, next) => {
    try {
      const comment = await this.commentService.findCommentById(
        req.params.commentId,
        req.query.populate as unknown as Parameters<
          typeof this.commentService.findCommentById
        >[1]
      );

      res.status(200).json(comment);
    } catch (error) {
      next(error);
    }
  };

  public createComment: RequestHandler = async (req, res, next) => {
    try {
      const post = await Post.findById(req.params.postId);

      if (!post) {
        return notfoundException('Post not found');
      }

      const comment = await this.commentService.createComment({
        ...req.body,
        user: req.user.id,
        post: req.params.postId,
      });

      res.status(201).json(comment);
    } catch (error) {
      next(error);
    }
  };
}

export default CommentController;
