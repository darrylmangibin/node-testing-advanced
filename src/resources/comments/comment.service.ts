import notfoundException from '@src/utils/exceptions/notfound.exception';
import mongoose, { FilterQuery, PaginateOptions, PopulateOptions } from 'mongoose';
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

  public createComment = async (body: Partial<CommentData>) => {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      const [comment] = await this.Comment.create([body], { session });

      await session.commitTransaction();
      await session.endSession();

      return comment;
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();

      throw error;
    }
  };

  public findCommentAndUpdate = async (commentId: string, body: Partial<CommentData>) => {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      const comment = await this.Comment.findByIdAndUpdate(commentId, body, {
        new: true,
        runValidators: true,
        session,
      });

      if (!comment) {
        return notfoundException('Comment not found');
      }

      await session.commitTransaction();
      await session.endSession();

      return comment;
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();

      throw error;
    }
  };
}

export default CommentService;
