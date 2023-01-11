import { Types } from 'mongoose';
import UserFactory from '../user.factory';
import UserService from '../user.service';

describe('@resources/user/user.service', () => {
  describe('UserService.findUserById', () => {
    it('should throw 404 error whend no user found', async () => {
      const invalidId = new Types.ObjectId().toString();

      await new UserService().findUserById(invalidId).catch(error => {
        expect(error).toMatchObject({
          message: 'User not found',
          statusCode: 404,
        });
      });
    });

    it('should return user when there is a user', async () => {
      const userFromFactory = await new UserFactory().create();

      const userFromService = await new UserService().findUserById(userFromFactory.id);

      expect(userFromService).toMatchObject({
        id: userFromFactory.id,
      });
    });
  });
});
