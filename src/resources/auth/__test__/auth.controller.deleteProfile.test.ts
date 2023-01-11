import { app } from '@src/server';
import supertest from 'supertest';
import { AUTH_CONTROLLER_PATH, AUTH_PROFILE_ENDPOINT } from '../auth.constants';

describe(AUTH_CONTROLLER_PATH, () => {
  describe(`AuthController.deleteProfile DELETE - ${AUTH_PROFILE_ENDPOINT}`, () => {
    it('should return delete user profile', async () => {
      const { user, token } = await signedIn();

      const res = await supertest(app)
        .delete(AUTH_PROFILE_ENDPOINT)
        .set({
          Authorization: `Bearer ${token}`,
        });

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        id: user.id,
        name: user.name,
        email: user.email,
      });
    });
  });
});
