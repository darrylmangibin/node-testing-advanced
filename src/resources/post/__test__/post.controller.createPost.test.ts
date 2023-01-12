import { faker } from '@faker-js/faker';
import { httpSupertestRequest } from '@src/utils/customSupertest';
import { POST_CONTROLLER_PATH, POST_ENDPOINT } from '../post.constants';

describe(POST_CONTROLLER_PATH, () => {
  describe(`PostController.createPost POST - ${POST_ENDPOINT}`, () => {
    it('should return 422 error response', async () => {
      const res = await httpSupertestRequest({
        endpoint: POST_ENDPOINT,
        method: 'POST',
        token: regularToken,
        body: {
          title: '',
        },
      });

      expect(res.status).toBe(422);
      expect(res.body).toMatchObject({
        message: 'Validation failed',
        error: {
          title: expect.any(String),
        },
      });
    });

    it('should return 201 success response', async () => {
      const input = {
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
      };

      const res = await httpSupertestRequest({
        endpoint: POST_ENDPOINT,
        method: 'POST',
        token: regularToken,
        body: input,
      });

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        ...input,
        user: regularUser.id,
      });
    });
  });
});
