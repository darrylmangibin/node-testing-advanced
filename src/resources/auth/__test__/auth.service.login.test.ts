import { faker } from '@faker-js/faker';
import { UserDocument } from '@src/resources/user/user.interface';
import ErrorException from '@src/utils/exceptions/error.exception';
import { AUTH_SERVICE_PATH } from '../auth.constants';
import AuthService from '../auth.service';

describe(AUTH_SERVICE_PATH, () => {
  describe('AuthService.login', () => {
    let user: UserDocument;
    const password = faker.internet.password();
    const wrongPassword = faker.internet.password();

    beforeEach(async () => {
      const { user: _user } = await signedIn({ password });

      user = _user;
    });

    it('should throw error when credentials are invalid', async () => {
      await new AuthService()
        .login({ email: user.email, password: wrongPassword })
        .catch(error => {
          expect(error).toBeInstanceOf(ErrorException);
          expect(error).toMatchObject({
            message: 'Invalid credentials',
            statusCode: 401,
          });
        });
    });

    it('should return user when credentials are valid', async () => {
      const loggedInUser = await new AuthService().login({
        email: user.email,
        password,
      });

      expect(loggedInUser).toMatchObject({
        id: user.id,
        email: user.email,
        name: user.name,
      });
    });
  });
});
