import { app } from '@src/server';
import { Types } from 'mongoose';
import supertest from 'supertest';
import { USER_CONTROLLER_PATH, USER_ENDPOINT } from '../user.constants';
import UserFactory from '../user.factory';
import { UserDocument } from '../user.interface';

describe(USER_CONTROLLER_PATH, () => {
  describe(`UserController.findUserById GET - ${USER_ENDPOINT}/:userId`, () => {
    let user: UserDocument;
    let token: string;

    beforeEach(async () => {
      const loggedIn = await signedIn();

      user = loggedIn.user;
      token = loggedIn.token;
    });

    it('should return 404 error response when user not found', async () => {
      const invalidUserId = new Types.ObjectId().toString();

      const res = await supertest(app)
        .get(`${USER_ENDPOINT}/${invalidUserId}`)
        .set({
          Authorization: `Bearer ${token}`,
        });

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({
        message: 'User not found',
      });
    });

    it('should return user success response', async () => {
      const newUser = await new UserFactory().create();

      const res = await supertest(app)
        .get(`${USER_ENDPOINT}/${newUser.id}`)
        .set({
          Authorization: `Bearer ${token}`,
        });

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      });
    });
  });
});
