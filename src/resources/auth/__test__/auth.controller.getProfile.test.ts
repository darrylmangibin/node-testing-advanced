import { app } from '@src/server';
import supertest from 'supertest';
import { AUTH_CONTROLLER_PATH, AUTH_PROFILE_ENDPOINT } from '../auth.constants';

describe(AUTH_CONTROLLER_PATH, () => {
  describe(`AuthController.getProfile GET - ${AUTH_PROFILE_ENDPOINT}`, () => {
    it('should return current user details', async () => {
      const { user, token } = await signedIn();

      const res = await supertest(app)
        .get(AUTH_PROFILE_ENDPOINT)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });
    });
  });
});
