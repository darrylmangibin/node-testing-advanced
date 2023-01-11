import { faker } from '@faker-js/faker';
import { UserDocument } from '@src/resources/user/user.interface';
import ErrorException from '@src/utils/exceptions/error.exception';
import comparePassword from '@src/utils/password/compare.password';
import { Error } from 'mongoose';
import { AUTH_SERVICE_PATH } from '../auth.constants';
import AuthService from '../auth.service';

describe(AUTH_SERVICE_PATH, () => {
  describe('AuthService.updatePassword', () => {
    let user: UserDocument;
    const currentPassword = faker.internet.password();
    const newPassword = faker.internet.password();
    const wrongPassword = faker.internet.password();

    beforeEach(async () => {
      const { user: _user } = await signedIn({ password: currentPassword });

      user = _user;
    });

    it('should throw error when new password is invalid', async () => {
      await new AuthService()
        .updatePassword(user.id, { currentPassword, newPassword: '1123' })
        .catch(error => {
          expect(error).toBeInstanceOf(Error.ValidationError);
          expect(error.errors).toMatchObject({
            password: expect.anything(),
          });
        });
    });

    it('should throw error when current password is not match to the user password', async () => {
      await new AuthService()
        .updatePassword(user.id, { currentPassword: wrongPassword, newPassword })
        .catch(error => {
          expect(error).toBeInstanceOf(ErrorException);
          expect(error).toMatchObject({
            message: 'Password incorrect',
            statusCode: 401,
          });
        });
    });

    it('should return update user password', async () => {
      const updatedUser = await new AuthService().updatePassword(user.id, {
        currentPassword,
        newPassword,
      });

      expect(updatedUser).toMatchObject({
        id: user.id,
        name: user.name,
        email: user.email,
        password: expect.not.stringContaining(user.password),
      });

      const isMatchPassword = await comparePassword(newPassword, updatedUser.password);

      expect(isMatchPassword).toBeTruthy();
    });
  });
});
