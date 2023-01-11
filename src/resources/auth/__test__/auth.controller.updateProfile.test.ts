import { faker } from '@faker-js/faker';
import { UserData, UserDocument } from '@src/resources/user/user.interface';
import User from '@src/resources/user/user.model';
import { app } from '@src/server';
import supertest from 'supertest';

describe('@resources/auth/auth.controller', () => {
  const endpoint = '/api/auth/profile';

  describe(`AuthController.updateProfile PUT - ${endpoint}`, () => {
    let user: UserDocument;
    let token: string;

    const inputs = {
      name: faker.name.fullName(),
      email: faker.internet.email(),
    } satisfies Partial<UserData>;

    beforeEach(async () => {
      const { user: _user, token: _token } = await signedIn();

      user = _user;
      token = _token;
    });

    it('should throw 422 error response when inputs are invalid', async () => {
      const res = await supertest(app)
        .put(endpoint)
        .send({
          name: '',
          email: '',
        })
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(422);
      expect(res.body).toMatchObject({
        message: 'Validation failed',
        error: {
          name: expect.any(String),
          email: expect.any(String),
        },
      });
    });

    it('should return updated profile success response when inputs are valid', async () => {
      const res = await supertest(app)
        .put(endpoint)
        .send(inputs)
        .set('Authorization', `Bearer ${token}`);

      const updatedUser = await User.findById(user.id);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        id: user.id,
        name: inputs.name,
        email: inputs.email,
      });
      expect(updatedUser).not.toMatchObject({
        name: user.name,
        email: user.email,
      });
    });
  });
});
