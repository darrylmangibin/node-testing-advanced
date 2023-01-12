import ErrorException from '@src/utils/exceptions/error.exception';
import { PopulateOption, PopulateOptions, Types } from 'mongoose';
import { COMMENT_SERVICE_PATH } from '../comment.constant';
import CommentFactory from '../comment.factory';
import CommentService from '../comment.service';

describe(COMMENT_SERVICE_PATH, () => {
  describe('CommentService.findCommentById', () => {
    it('should throw 404', async () => {
      await new CommentService()
        .findCommentById(new Types.ObjectId().toString())
        .catch(error => {
          expect(error).toBeInstanceOf(ErrorException);
          expect(error).toMatchObject({
            message: 'Comment not found',
            statusCode: 404,
          });
        });
    });

    it('should return comment with populate', async () => {
      const comment = await new CommentFactory().create();

      const commentFromService = await new CommentService().findCommentById(comment.id, [
        {
          path: 'user',
        },
        { path: 'post' },
      ]);

      expect(commentFromService).toMatchObject({
        id: comment.id,
        user: expect.objectContaining({ id: expect.any(String) }),
        post: expect.objectContaining({ id: expect.any(String) }),
      });
    });
  });
});
