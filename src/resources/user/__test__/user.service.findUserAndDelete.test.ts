import ErrorException from '@src/utils/exceptions/error.exception';
import { Types } from 'mongoose';
import { USER_SERVICE_PATH } from '../user.constants';
import UserFactory from '../user.factory';
import User from '../user.model';
import UserService from '../user.service';

describe(USER_SERVICE_PATH, () => {
  describe('UserService.findUserAndDelete', () => {
    it('should throw 404 error when no user found', async () => {
      const invalidUserId = new Types.ObjectId().toString();

      await new UserService().findUserAndDelete(invalidUserId).catch(error => {
        expect(error).toBeInstanceOf(ErrorException);
        expect(error).toMatchObject({
          message: 'User not found',
          statusCode: 404,
        });
      });
    });

    it('should return deleted user', async () => {
      const user = await new UserFactory().create();

      const deletedUser = await new UserService().findUserAndDelete(user.id);

      expect(deletedUser).toMatchObject({
        id: user.id,
      });
      expect(await User.findById(deletedUser.id)).toBeNull();
    });
  });
});
