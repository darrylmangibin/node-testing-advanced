import { faker } from '@faker-js/faker';
import ErrorException from '@src/utils/exceptions/error.exception';
import keysPaginate from '@src/utils/paginate/keys.paginate';
import { Error, Types } from 'mongoose';
import { COMMENT_SERVICE_PATH } from '../comment.constant';
import CommentFactory from '../comment.factory';
import { CommentDocument } from '../comment.interface';
import CommentService from '../comment.service';

describe(COMMENT_SERVICE_PATH, () => {
  describe('CommentService.findCommentAndUpdate', () => {
    const input = {
      body: faker.lorem.paragraph(),
    };
    let comment: CommentDocument;

    beforeEach(async () => {
      comment = await new CommentFactory().create();
    });

    it('should throw 404 error', async () => {
      await new CommentService()
        .findCommentAndUpdate(new Types.ObjectId().toString(), input)
        .catch(error => {
          expect(error).toBeInstanceOf(ErrorException);
          expect(error).toMatchObject({
            message: 'Comment not found',
            statusCode: 404,
          });
        });
    });

    it('should throw 422 error', async () => {
      await new CommentService().findCommentAndUpdate(comment.id, {}).catch(error => {
        expect(error).toBeInstanceOf(Error.ValidationError);
        expect(error.errors).toMatchObject({
          body: expect.anything(),
        });
      });
    });
  });
});
