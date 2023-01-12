import { faker } from '@faker-js/faker';
import PostFactory from '@src/resources/post/post.factory';
import { httpSupertestRequest } from '@src/utils/customSupertest';
import { Types } from 'mongoose';
import { COMMENT_CONTROLLER_PATH, COMMENT_ENDPOINT } from '../comment.constant';
import CommentFactory from '../comment.factory';

describe(COMMENT_CONTROLLER_PATH, () => {
  describe(`CommentController.findCommentAndUpdate PUT - ${COMMENT_ENDPOINT}/:commentId`, () => {
    const input = {
      body: faker.lorem.paragraph(),
    };

    it('should return 404 error response', async () => {
      const res = await httpSupertestRequest({
        method: 'PUT',
        endpoint: `${COMMENT_ENDPOINT}/${new Types.ObjectId().toString()}`,
        token: regularToken,
        body: input,
      });

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({
        message: 'Comment not found',
      });
    });

    it('should return 422 error response', async () => {
      const res = await httpSupertestRequest({
        method: 'PUT',
        endpoint: `${COMMENT_ENDPOINT}/${new Types.ObjectId().toString()}`,
        token: regularToken,
      });

      expect(res.status).toBe(422);
      expect(res.body).toMatchObject({
        message: 'Validation failed',
        error: {
          body: expect.any(String),
        },
      });
    });

    it('should return 403 error response', async () => {
      const comment = await new CommentFactory().create();
      const res = await httpSupertestRequest({
        method: 'PUT',
        endpoint: `${COMMENT_ENDPOINT}/${comment.id}`,
        token: regularToken,
        body: input,
      });

      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({
        message: 'Forbidden. Not allowed to perform this action',
      });
    });

    it('should return 200 success response', async () => {
      const comment = await new CommentFactory().create({ user: regularUser.id });
      const res = await httpSupertestRequest({
        method: 'PUT',
        endpoint: `${COMMENT_ENDPOINT}/${comment.id}`,
        token: regularToken,
        body: input,
      });

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        id: comment.id,
        body: input.body,
      });
    });
  });
});
