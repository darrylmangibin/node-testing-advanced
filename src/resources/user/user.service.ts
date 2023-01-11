import ErrorException from '@src/utils/exceptions/error.exception';
import mongoose from 'mongoose';
import { UserData } from './user.interface';
import User from './user.model';

class UserService {
  private User = User;

  public create = async (body: Partial<UserData>) => {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const isUserExists = Boolean(await this.User.findOne({ email: body.email }));

      if (isUserExists) {
        throw new ErrorException('Email already exists', 400);
      }

      const [user] = await this.User.create([body], { session });

      await session.commitTransaction();
      await session.endSession();

      return user;
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();

      throw error;
    }
  };
}

export default UserService;
