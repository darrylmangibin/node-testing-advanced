import notfoundException from '@src/utils/exceptions/notfound.exception';
import { FilterQuery, PaginateOptions, PopulateOptions } from 'mongoose';
import { CommentData } from './comment.interface';
import Comment from './comment.model';

class CommentService {
  private Comment = Comment;

  public findComments = async (
    query: FilterQuery<CommentData>,
    options: PaginateOptions
  ) => {
    try {
      const results = await this.Comment.paginate(query, options);

      return results;
    } catch (error) {
      throw error;
    }
  };

  public findCommentById = async (
    commentId: string,
    populate?: PopulateOptions | (PopulateOptions | string)[]
  ) => {
    try {
      let query = this.Comment.findById(commentId);

      if (populate) {
        query = query.populate<CommentData>(populate);
      }

      const comment = await query;

      if (!comment) {
        return notfoundException('Comment not found');
      }

      return comment;
    } catch (error) {
      throw error;
    }
  };
}

export default CommentService;
