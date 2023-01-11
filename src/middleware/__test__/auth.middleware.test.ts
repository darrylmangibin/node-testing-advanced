import { app } from '@src/server';
import signToken from '@src/utils/token/sign.token';
import { Types } from 'mongoose';
import supertest from 'supertest';

describe('@middleware', () => {
  describe('authMiddleware', () => {
    const endpoint = '/api/auth/test-auth-middleware';

    it('should return no token 401 error response', async () => {
      const res = await supertest(app).get(endpoint);

      expect(res.status).toBe(401);
      expect(res.body).toMatchObject({
        message: 'Unauthorized. No token',
      });
    });

    it('should return token error 401 error response', async () => {
      const res = await supertest(app).get(endpoint).set('Authorization', 'Bearer 123');

      expect(res.status).toBe(401);
      expect(res.body).toMatchObject({
        message: 'Unauthorized. Token error',
      });
    });

    it('should return no user 401 error response', async () => {
      const tokenWithNoUser = signToken({ id: new Types.ObjectId().toString() });
      const res = await supertest(app)
        .get(endpoint)
        .set('Authorization', `Bearer ${tokenWithNoUser}`);

      expect(res.status).toBe(401);
      expect(res.body).toMatchObject({
        message: 'Unauthorized. No user',
      });
    });

    it('should return user in request and global', async () => {
      const { user, token } = await signedIn();

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
