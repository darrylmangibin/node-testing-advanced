import { app } from '@src/server';
import keysPaginate from '@src/utils/paginate/keys.paginate';
import supertest from 'supertest';
import { USER_CONTROLLER_PATH, USER_ENDPOINT } from '../user.constants';
import UserFactory from '../user.factory';
import { UserDocument } from '../user.interface';

describe(USER_CONTROLLER_PATH, () => {
  describe(`UserController.findUsers GET - ${USER_ENDPOINT}`, () => {
    let user: UserDocument;
    let token: string;
    let users: UserDocument[];

    beforeEach(async () => {
      const loggedIn = await signedIn();

      user = loggedIn.user;
      token = loggedIn.token;
      users = await new UserFactory().createMany(12);
    });

    it('should return pagination response for users', async () => {
      const limit = 8;
      const page = 1;

      const res = await supertest(app)
        .get(USER_ENDPOINT)
        .set({
          Authorization: `Bearer ${token}`,
        })
        .query({ limit, page });

      expect(res.status).toBe(200);
      expect(Object.keys(res.body)).toEqual(expect.arrayContaining(keysPaginate));
      expect(res.body.docs.length).toBe(limit);
      expect(res.body.totalDocs).toBe(users.length);
    });

    it('should return filtered users', async () => {
      const randomUser = users[Math.floor(Math.random() * users.length)];

      const res = await supertest(app)
        .get(USER_ENDPOINT)
        .set({
          Authorization: `Bearer ${token}`,
        })
        .query({
          filter: {
            email: {
              $regex: randomUser.email,
              $options: 'i',
            },
          },
        });

      expect(res.body.docs).toEqual(
        expect.arrayContaining([expect.objectContaining({ id: randomUser.id })])
      );
      expect(res.body.docs.length).toBe(1);
    });
  });
});
