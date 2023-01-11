import { faker } from '@faker-js/faker';

import { UserDocument } from '@src/resources/user/user.interface';
import { app } from '@src/server';
import supertest from 'supertest';

describe(`AuthController`, () => {
  const endpoint = '/api/auth/login';

  describe(`login POST - ${endpoint}`, () => {
    let user: UserDocument;
    const password = faker.internet.password();
    const wrongPassword = faker.internet.password();

    beforeEach(async () => {
      const { user: _user } = await signedIn({ password });

      user = _user;
    });
    it('should return 401 error response credentials are invalid', async () => {
      const res = await supertest(app).post(endpoint).send({
        email: user.email,
        password: wrongPassword,
      });

      expect(res.status).toBe(401);
      expect(res.body).toMatchObject({
        message: 'Invalid credentials',
      });
    });

    it('should return 422 error response when inputs are invalid', async () => {
      const res = await supertest(app).post(endpoint).send({
        email: '',
        password: '',
      });

      expect(res.status).toBe(422);
      expect(res.body).toMatchObject({
        message: 'Validation failed',
        error: {
          email: expect.any(String),
          password: expect.any(String),
        },
      });
    });

    it('should return token when successfully logging in', async () => {
      const res = await supertest(app).post(endpoint).send({
        email: user.email,
        password,
      });

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        token: expect.any(String),
      });
    });
  });
});
