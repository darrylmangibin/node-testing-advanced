import { faker } from '@faker-js/faker';
import ErrorException from '@src/utils/exceptions/error.exception';
import { Error, Types } from 'mongoose';
import { UserData, UserDocument, UserRole } from '../user.interface';
import User from '../user.model';
import UserService from '../user.service';

describe('@resources/user/user.service', () => {
  describe('UserService.findUserAndUpdate', () => {
    let user: UserDocument;

    beforeEach(async () => {
      const { user: _user } = await signedIn();

      user = _user;
    });

    const inputs = {
      name: faker.name.fullName(),
      email: faker.internet.email(),
      role: 'admin',
    } satisfies Partial<UserData>;

    it('should throw 404 error when no user found', async () => {
      const invalidUserId = new Types.ObjectId().toString();

      await new UserService().findUserAndUpdate(invalidUserId, inputs).catch(error => {
        expect(error).toBeInstanceOf(ErrorException);
        expect(error).toMatchObject({
          message: 'User not found',
          statusCode: 404,
        });
      });
    });

    it('should throw 422 error when validation failed', async () => {
      await new UserService()
        .findUserAndUpdate(user.id, {
          name: '',
          email: '',
          role: 'invalidRole' as UserRole,
        })
        .catch(error => {
          expect(error).toBeInstanceOf(Error.ValidationError);
          expect(error.errors).toMatchObject({
            name: expect.anything(),
            email: expect.anything(),
            role: expect.anything(),
          });
        });
    });

    it('should return updated user when inputs ar valid', async () => {
      const userFromService = await new UserService().findUserAndUpdate(user.id, inputs);

      const updatedUser = await User.findById(userFromService.id);

      expect(updatedUser).toMatchObject({
        id: userFromService.id,
        name: userFromService.name,
        email: userFromService.email,
        role: userFromService.role,
      });
    });
  });
});
