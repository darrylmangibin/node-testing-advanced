import ErrorException from '@src/utils/exceptions/error.exception';
import notfoundException from '@src/utils/exceptions/notfound.exception';
import optionsPaginate from '@src/utils/paginate/options.paginate';
import { RequestHandler } from 'express';
import { FilterQuery, PaginateOptions } from 'mongoose';
import Post from '../post/post.model';
import { CommentData, CommentDocument } from './comment.interface';
import Comment from './comment.model';
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

  public findCommentAndUpdate: RequestHandler = async (req, res, next) => {
    try {
      const comment = await Comment.findById(req.params.commentId);

      if (!comment) {
        return notfoundException('Comment not found');
      }

      this.checkCommentOwner(comment, req.user.id);

      const updatedComment = await this.commentService.findCommentAndUpdate(
        req.params.commentId,
        {
          ...req.body,
        }
      );

      res.status(200).json(updatedComment);
    } catch (error) {
      next(error);
    }
  };

  public findCommentAndDelete: RequestHandler = async (req, res, next) => {
    try {
      const comment = await Comment.findById(req.params.commentId);

      if (!comment) {
        return notfoundException('Comment not found');
      }

      this.checkCommentOwner(comment, req.user.id);

      const deletedComment = await this.commentService.findCommentAndDelete(
        req.params.commentId
      );

      res.status(200).json(deletedComment);
    } catch (error) {
      next(error);
    }
  };

  private checkCommentOwner(comment: CommentDocument, userId: string) {
    if (comment.user.toString() !== userId) {
      throw new ErrorException('Forbidden. Not allowed to perform this action', 403);
    }
  }
}

export default CommentController;
