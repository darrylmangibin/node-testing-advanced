import { app } from '@src/server';
import supertest from 'supertest';

describe('@middleware', () => {
  describe('adminMiddleware', () => {
    const endpoint = '/api/auth/test-middleware';

    it('should return 403 error response when user is not an admin', async () => {
      const { token } = await signedIn();

      const res = await supertest(app)
        .get(endpoint)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({
        message: 'Forbidden. Admin can only access this route',
      });
    });

    it('should return success response when user is an admin', async () => {
      const { token, user } = await signedIn({ role: 'admin' });

      const res = await supertest(app)
        .get(endpoint)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        reqUser: {
          id: user.id,
        },
        globalAuthUser: {
          id: user.id,
        },
      });
    });
  });
});
