import { faker } from '@faker-js/faker';
import { UserDocument } from '@src/resources/user/user.interface';
import ErrorException from '@src/utils/exceptions/error.exception';
import AuthService from '../auth.service';

describe('@resources/auth/auth.service', () => {
  describe('AuthService.login', () => {
    let user: UserDocument;
    const password = faker.internet.password();
    const wrongPassword = faker.internet.password();

    beforeEach(async () => {
      const { user: _user } = await signedIn({ password });

      user = _user;
    });

    it('should throw 401 error', async () => {
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
