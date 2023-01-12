import PostFactory from '@src/resources/post/post.factory';
import Post from '@src/resources/post/post.model';
import { app } from '@src/server';
import { httpSupertestRequest } from '@src/utils/customSupertest';
import { Types } from 'mongoose';
import supertest from 'supertest';
import { USER_CONTROLLER_PATH, USER_ENDPOINT } from '../user.constants';
import UserFactory from '../user.factory';

describe(USER_CONTROLLER_PATH, () => {
  describe(`UserController.findUserAndDelete DELETE - ${USER_ENDPOINT}/:userId`, () => {
    let request = async (endpoint: string, token?: string) => {
      return supertest(app)
        .delete(endpoint)
        .set({ Authorization: `Bearer ${token}` });
    };

    it('should return 404 error response when no user found', async () => {
      const invalidId = new Types.ObjectId().toString();

      const res = await request(`${USER_ENDPOINT}/${invalidId}`, adminToken);

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({
        message: 'User not found',
      });
    });

    it('should return 403 response when user is not an admin', async () => {
      const res = await request(`${USER_ENDPOINT}/${adminUser.id}`, regularToken);

      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({
        message: 'Forbidden. Admin can only access this route',
      });
    });

    it('should return 200 success response with the deleted user', async () => {
      const res = await request(`${USER_ENDPOINT}/${regularUser.id}`, adminToken);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        id: regularUser.id,
        name: regularUser.name,
        email: regularUser.email,
      });
    });

    it('should delete user posts', async () => {
      const user = await new UserFactory().create();

      const posts = await new PostFactory().createMany(5, { user: user.id });

      const res = await httpSupertestRequest({
        method: 'DELETE',
        token: adminToken,
        endpoint: `${USER_ENDPOINT}/${user.id}`,
      });

      expect(res.status).toBe(200);

      for await (let post of posts) {
        expect(await Post.findById(post.id)).toBeNull();
      }
    });
  });
});
