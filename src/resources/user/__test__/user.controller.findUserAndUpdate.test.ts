import { faker } from '@faker-js/faker';
import { app } from '@src/server';
import { Types } from 'mongoose';
import supertest from 'supertest';
import { USER_CONTROLLER_PATH, USER_ENDPOINT } from '../user.constants';
import { UserData, UserDocument, UserRole } from '../user.interface';

describe(USER_CONTROLLER_PATH, () => {
  describe(`UserController.findUserAndUpdate PUT - ${USER_ENDPOINT}/:userId`, () => {
    // let regularUser: UserDocument;
    // let adminUser: UserDocument;
    // let regularToken: string;
    // let adminToken: string;

    let request = async (endpoint: string, token?: string, body?: Partial<UserData>) => {
      return supertest(app)
        .put(endpoint)
        .set({ Authorization: `Bearer ${token}` })
        .send(body);
    };

    const inputs = {
      name: faker.name.fullName(),
      email: faker.internet.email(),
      role: 'admin',
    } satisfies Partial<UserData>;

    // beforeEach(async () => {
    //   const regularSignedIn = await signedIn();
    //   const adminSignedIn = await signedIn({ role: 'admin' });

    //   regularUser = regularSignedIn.user;
    //   regularToken = regularSignedIn.token;
    //   adminUser = adminSignedIn.user;
    //   adminToken = adminSignedIn.token;
    // });

    it('should return 403 error response when user is not an admin', async () => {
      const res = await request(`${USER_ENDPOINT}/${adminUser.id}`, regularToken);

      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({
        message: 'Forbidden. Admin can only access this route',
      });
    });

    it('should return 404 error response when no user found', async () => {
      const invalidUserId = new Types.ObjectId().toString();

      const res = await request(`${USER_ENDPOINT}/${invalidUserId}`, adminToken, inputs);

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({
        message: 'User not found',
      });
    });

    it('should return 422 error response when inputs are invalid', async () => {
      const res = await request(`${USER_ENDPOINT}/${regularUser.id}`, adminToken, {
        name: '',
        email: '',
        role: 'special' as UserRole,
      });

      expect(res.status).toBe(422);
      expect(res.body).toMatchObject({
        message: 'Validation failed',
        error: {
          name: expect.any(String),
          email: expect.any(String),
          role: expect.any(String),
        },
      });
    });

    it('should return 400 error response when email already exists', async () => {
      const res = await request(`${USER_ENDPOINT}/${regularUser.id}`, adminToken, {
        ...inputs,
        email: adminUser.email,
      });

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        message: 'Already exists',
        error: { email: `${adminUser.email} already exists` },
      });
    });

    it('should return 200 success response when all inputs are valid', async () => {
      const res = await request(`${USER_ENDPOINT}/${regularUser.id}`, adminToken, inputs);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        id: regularUser.id,
        name: inputs.name,
        email: inputs.email,
        role: inputs.role,
      });
    });
  });
});
