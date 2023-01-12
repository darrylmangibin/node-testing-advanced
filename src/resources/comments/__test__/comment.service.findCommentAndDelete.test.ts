import { faker } from '@faker-js/faker';
import ErrorException from '@src/utils/exceptions/error.exception';
import { Error, Types } from 'mongoose';
import { COMMENT_SERVICE_PATH } from '../comment.constant';
import CommentFactory from '../comment.factory';
import { CommentDocument } from '../comment.interface';
import Comment from '../comment.model';
import CommentService from '../comment.service';

describe(COMMENT_SERVICE_PATH, () => {
  describe('CommentService.findCommentAndUpdate', () => {
    let comment: CommentDocument;

    beforeEach(async () => {
      comment = await new CommentFactory().create();
    });

    it('should throw 404 error', async () => {
      await new CommentService()
        .findCommentAndDelete(new Types.ObjectId().toString())
        .catch(error => {
          expect(error).toBeInstanceOf(ErrorException);
          expect(error).toMatchObject({
            message: 'Comment not found',
            statusCode: 404,
          });
        });
    });

    it('should return deleted comment', async () => {
      const deletedComment = await new CommentService().findCommentAndDelete(comment.id);

      expect(deletedComment).toMatchObject({
        id: comment.id,
      });
      expect(await Comment.findById(deletedComment.id)).toBeNull();
    });
  });
});
