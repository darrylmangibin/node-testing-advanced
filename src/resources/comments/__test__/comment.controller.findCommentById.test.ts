import { httpSupertestRequest } from '@src/utils/customSupertest';
import { Types } from 'mongoose';
import { COMMENT_CONTROLLER_PATH, COMMENT_ENDPOINT } from '../comment.constant';
import CommentFactory from '../comment.factory';

describe(COMMENT_CONTROLLER_PATH, () => {
  describe(`CommentController.findCommentById GET - ${COMMENT_ENDPOINT}/:commentId`, () => {
    it('should return 404 error response', async () => {
      const res = await httpSupertestRequest({
        endpoint: `${COMMENT_ENDPOINT}/${new Types.ObjectId().toString()}`,
        method: 'GET',
        token: regularToken,
      });

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({
        message: 'Comment not found',
      });
    });

    it('should return 200 success response', async () => {
      const comment = await new CommentFactory().create();

      const res = await httpSupertestRequest({
        endpoint: `${COMMENT_ENDPOINT}/${comment.id}`,
        method: 'GET',
        token: regularToken,
      });

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        id: comment.id,
      });
    });
  });
});
