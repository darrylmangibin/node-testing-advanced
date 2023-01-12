import { faker } from '@faker-js/faker';
import { httpSupertestRequest } from '@src/utils/customSupertest';
import { Types } from 'mongoose';
import { POST_CONTROLLER_PATH, POST_ENDPOINT } from '../post.constants';
import PostFactory from '../post.factory';
import { PostData } from '../post.interface';

describe(POST_CONTROLLER_PATH, () => {
  describe(`PostController.findPostAndUpdate PUT -${POST_ENDPOINT}/:postId`, () => {
    const input = {
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
    } satisfies Partial<PostData>;

    it('should return 404 error response', async () => {
      const res = await httpSupertestRequest({
        method: 'PUT',
        endpoint: `${POST_ENDPOINT}/${new Types.ObjectId().toString()}`,
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
        method: 'PUT',
        endpoint: `${POST_ENDPOINT}/${new Types.ObjectId().toString()}`,
        token: regularToken,
      });

      expect(res.status).toBe(422);
      expect(res.body).toMatchObject({
        message: 'Validation failed',
        error: {
          title: expect.any(String),
        },
      });
    });

    it('should return 403 error response', async () => {
      const post = await new PostFactory().create();

      const res = await httpSupertestRequest({
        method: 'PUT',
        endpoint: `${POST_ENDPOINT}/${post.id}`,
        token: regularToken,
        body: input,
      });

      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({
        message: 'Forbidden. Not allowed to perform this action',
      });
    });

    it('should return 200 success response', async () => {
      const post = await new PostFactory().create({ user: regularUser.id });

      const res = await httpSupertestRequest({
        method: 'PUT',
        endpoint: `${POST_ENDPOINT}/${post.id}`,
        token: regularToken,
        body: input,
      });

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        id: post.id,
        ...input,
      });
    });
  });
});
