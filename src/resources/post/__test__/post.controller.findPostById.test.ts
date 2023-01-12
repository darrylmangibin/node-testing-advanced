import { httpSupertestRequest } from '@src/utils/customSupertest';
import { Types } from 'mongoose';
import { POST_CONTROLLER_PATH, POST_ENDPOINT } from '../post.constants';
import PostFactory from '../post.factory';

describe(POST_CONTROLLER_PATH, () => {
  describe(`PostController.findPostById - GET ${POST_ENDPOINT}`, () => {
    it('should return 404 error response', async () => {
      const res = await httpSupertestRequest({
        method: 'GET',
        endpoint: `${POST_ENDPOINT}/${new Types.ObjectId().toString()}`,
        token: regularToken,
      });

      expect(res.status).toBe(404);
    });

    it('should return 200 success response', async () => {
      const post = await new PostFactory().create();

      const res = await httpSupertestRequest({
        method: 'GET',
        endpoint: `${POST_ENDPOINT}/${post.id}`,
        token: regularToken,
      });

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        id: post.id,
      });
    });
  });
});
