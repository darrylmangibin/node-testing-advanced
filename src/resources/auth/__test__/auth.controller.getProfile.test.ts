import { app } from '@src/server';
import supertest from 'supertest';

describe('@resources/auth/auth.controller', () => {
  const endpoint = '/api/auth/profile';

  describe(`AuthController.getProfile GET - ${endpoint}`, () => {
    it('should return current user details', async () => {
      const { user, token } = await signedIn();

      const res = await supertest(app)
        .get(endpoint)
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
