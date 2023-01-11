import User from '@resources/user/user.model';
import ErrorException from '@src/utils/exceptions/error.exception';
import comparePassword from '@src/utils/password/compare.password';
import { UserData } from '../user/user.interface';

class AuthService {
  private User = User;

  public login = async (body: Pick<UserData, 'email' | 'password'>) => {
    try {
      const user = await this.User.findOne({ email: body.email }).select('+password');

      const isPasswordMatch = await comparePassword(body.password, user?.password);

      if (!isPasswordMatch || !user) {
        throw new ErrorException('Invalid credentials', 401);
      }

      return user;
    } catch (error) {
      throw error;
    }
  };
}

export default AuthService;
