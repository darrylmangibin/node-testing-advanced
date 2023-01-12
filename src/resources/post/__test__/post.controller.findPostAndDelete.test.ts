import { httpSupertestRequest } from '@src/utils/customSupertest';
import { Types } from 'mongoose';
import { POST_CONTROLLER_PATH, POST_ENDPOINT } from '../post.constants';
import PostFactory from '../post.factory';

describe(POST_CONTROLLER_PATH, () => {
  describe(`PostController.findPostAndDelete DELETE - ${POST_ENDPOINT}/:postId`, () => {
    it('should return 404 error response', async () => {
      const res = await httpSupertestRequest({
        method: 'DELETE',
        endpoint: `${POST_ENDPOINT}/${new Types.ObjectId().toString()}`,
        token: regularToken,
      });

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({
        message: 'Post not found',
      });
    });

    it('should return 403 error response', async () => {
      const post = await new PostFactory().create();

      const res = await httpSupertestRequest({
        method: 'DELETE',
        endpoint: `${POST_ENDPOINT}/${post.id}`,
        token: regularToken,
      });

      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({
        message: 'Forbidden. Not allowed to perform this action',
      });
    });

    it('should return success response', async () => {
      const post = await new PostFactory().create({ user: regularUser.id });

      const res = await httpSupertestRequest({
        method: 'DELETE',
        endpoint: `${POST_ENDPOINT}/${post.id}`,
        token: regularToken,
      });

      console.log(res.body);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        id: post.id,
      });
    });
  });
});
