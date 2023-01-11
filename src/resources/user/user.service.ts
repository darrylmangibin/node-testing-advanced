import ErrorException from '@src/utils/exceptions/error.exception';
import notfoundException from '@src/utils/exceptions/notfound.exception';
import mongoose, { FilterQuery, PaginateOptions, PopulateOptions } from 'mongoose';
import { UserData } from './user.interface';
import User from './user.model';

class UserService {
  private User = User;

  public findUsers = async (query: FilterQuery<UserData>, options: PaginateOptions) => {
    try {
      const results = await this.User.paginate(query, options);

      return results;
    } catch (error) {
      throw error;
    }
  };

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

  public findUserById = async (userId: string, populate?: PopulateOptions) => {
    try {
      let query = this.User.findById(userId);

      if (populate) {
        query = query.populate<UserData>(populate);
      }
      const user = await query;

      if (!user) {
        return notfoundException('User not found');
      }

      return user;
    } catch (error) {
      throw error;
    }
  };

  public findUserAndUpdate = async (userId: string, body: Partial<UserData>) => {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const user = await this.User.findByIdAndUpdate(userId, body, {
        new: true,
        runValidators: true,
        session,
      });

      if (!user) {
        return notfoundException('User not found');
      }

      await session.commitTransaction();
      await session.endSession();

      return user;
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();

      throw error;
    }
  };

  public findUserAndDelete = async (userId: string) => {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const user = await User.findOneAndRemove({ _id: userId }, { session });

      if (!user) {
        return notfoundException('User not found');
      }

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
