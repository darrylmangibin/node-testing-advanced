import { faker } from '@faker-js/faker';
import { POST_ENDPOINT } from '@src/resources/post/post.constants';
import PostFactory from '@src/resources/post/post.factory';
import { httpSupertestRequest } from '@src/utils/customSupertest';
import { Types } from 'mongoose';
import { COMMENT_CONTROLLER_PATH } from '../comment.constant';

describe(COMMENT_CONTROLLER_PATH, () => {
  describe(`CommentController.createComment POST - ${POST_ENDPOINT}/:postId/comments`, () => {
    const input = {
      body: faker.lorem.paragraph(),
    };

    it('should return 404 error response', async () => {
      const res = await httpSupertestRequest({
        method: 'POST',
        endpoint: `${POST_ENDPOINT}/${new Types.ObjectId().toString()}/comments`,
        token: regularToken,
        body: input,
      });

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({
        message: 'Post not found',
      });
    });

    it('should return 422 error response', async () => {
      const res = await httpSupertestRequest({
        method: 'POST',
        endpoint: `${POST_ENDPOINT}/${new Types.ObjectId().toString()}/comments`,
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

    it('should return 201 success response', async () => {
      const post = await new PostFactory().create();
      const res = await httpSupertestRequest({
        method: 'POST',
        endpoint: `${POST_ENDPOINT}/${post.id}/comments`,
        token: regularToken,
        body: input,
      });

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        body: input.body,
        post: post.id,
      });
    });
  });
});
