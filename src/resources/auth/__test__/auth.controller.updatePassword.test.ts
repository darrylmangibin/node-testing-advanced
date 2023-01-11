import { faker } from '@faker-js/faker';
import { UserDocument } from '@src/resources/user/user.interface';
import { app } from '@src/server';
import comparePassword from '@src/utils/password/compare.password';
import supertest from 'supertest';
import { AUTH_CONTROLLER_PATH, AUTH_UPDATE_PASSWORD_ENDPOINT } from '../auth.constants';
import { AuthUpdatePasswordRequestBody } from '../auth.interface';

describe(AUTH_CONTROLLER_PATH, () => {
  describe(`AuthController.updatePassword - PUT ${AUTH_UPDATE_PASSWORD_ENDPOINT}`, () => {
    let user: UserDocument;
    let token: string;

    const currentPassword = faker.internet.password();
    const newPassword = faker.internet.password();
    const wrongPassword = faker.internet.password();

    beforeEach(async () => {
      const { user: _user, token: _token } = await signedIn({
        password: currentPassword,
      });

      user = _user;
      token = _token;
    });

    it('should return 422 error response when invalid inputs', async () => {
      const res = await supertest(app)
        .put(AUTH_UPDATE_PASSWORD_ENDPOINT)
        .send({
          newPassword: '',
          currentPassword: '',
        })
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(422);
      expect(res.body).toMatchObject({
        message: 'Validation failed',
        error: {
          newPassword: expect.any(String),
          currentPassword: expect.any(String),
        },
      });
    });

    it('should 401 error response when current password field is not match to user current password', async () => {
      const res = await supertest(app)
        .put(AUTH_UPDATE_PASSWORD_ENDPOINT)
        .send({
          newPassword,
          currentPassword: wrongPassword,
        })
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(401);
      expect(res.body).toMatchObject({
        message: 'Password incorrect',
      });
    });

    it('should return success response when inputs are valid', async () => {
      const res = await supertest(app)
        .put(AUTH_UPDATE_PASSWORD_ENDPOINT)
        .send({
          newPassword,
          currentPassword,
        })
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        id: user.id,
        password: expect.not.stringContaining(user.password),
      });

      const isMatchPassword = await comparePassword(newPassword, res.body.password);

      expect(isMatchPassword).toBeTruthy();
    });
  });
});
