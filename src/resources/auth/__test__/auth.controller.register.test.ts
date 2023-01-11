import { faker } from '@faker-js/faker';
import jwt from 'jsonwebtoken';

import UserFactory from '@src/resources/user/user.factory';
import { UserData, UserDocument } from '@src/resources/user/user.interface';
import { app } from '@src/server';
import supertest from 'supertest';
import verifyToken, { isAppPayload } from '@src/utils/token/verify.token';
import User from '@src/resources/user/user.model';

describe('@resources/auth/auth.controller', () => {
  const endpoint = '/api/auth/register';

  describe(`AuthController.register POST - ${endpoint}`, () => {
    it('should return 422 error response when inputs are invalid', async () => {
      const res = await supertest(app).post(endpoint).send({
        name: '',
        email: '',
      });

      expect(res.status).toBe(422);
      expect(res.body).toMatchObject({
        message: 'Validation failed',
        error: {
          name: expect.any(String),
          email: expect.any(String),
          password: expect.any(String),
        },
      });
    });

    it('should return 400 error response when email already exists', async () => {
      const user = await new UserFactory().create();

      const res = await supertest(app).post(endpoint).send({
        name: faker.name.fullName(),
        email: user.email,
        password: '123456',
      });

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        message: 'Email already exists',
      });
    });

    it('should return token when successfully registered', async () => {
      const inputs = {
        name: faker.name.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      } satisfies Partial<UserData>;

      const res = await supertest(app).post(endpoint).send(inputs);

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        token: expect.any(String),
      });

      const { token } = res.body;

      const decoded = await verifyToken(token);

      let user: UserDocument | null = null;

      if (isAppPayload(decoded)) {
        user = await User.findById(decoded.id);
      }
      expect(user).not.toBeNull();
      expect(user?.email).toEqual(inputs.email);
    });
  });
});
