import User from '@resources/user/user.model';
import ErrorException from '@src/utils/exceptions/error.exception';
import notfoundException from '@src/utils/exceptions/notfound.exception';
import comparePassword from '@src/utils/password/compare.password';
import mongoose from 'mongoose';
import { UserData } from '../user/user.interface';
import { AuthUpdatePasswordRequestBody } from './auth.interface';

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

  public updatePassword = async (userId: string, body: AuthUpdatePasswordRequestBody) => {
    try {
      const user = await this.User.findById(userId).select('+password');

      if (!user) {
        return notfoundException('User not found');
      }

      const isPasswordMatch = await comparePassword(body.currentPassword, user.password);

      if (!isPasswordMatch) {
        throw new ErrorException('Password incorrect', 401);
      }

      user.password = body.newPassword;

      const updatedUser = await user.save();

      return updatedUser;
    } catch (error) {
      throw error;
    }
  };
}

export default AuthService;
