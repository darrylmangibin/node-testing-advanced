import { faker } from '@faker-js/faker';

import ErrorException from '@src/utils/exceptions/error.exception';
import { Error } from 'mongoose';
import UserFactory from '@resources/user/user.factory';
import { UserData } from '@resources/user/user.interface';
import User from '@resources/user/user.model';
import UserService from '@resources/user/user.service';
import comparePassword from '@src/utils/password/compare.password';

describe('@resources/user/user.service', () => {
  describe('UserService create', () => {
    it('should throw 400 error when email already exists', async () => {
      const user = await new UserFactory().create();

      await new UserService()
        .create({
          email: user.email,
          password: '123456',
          name: faker.name.fullName(),
        })
        .catch(error => {
          expect(error).toBeInstanceOf(ErrorException);
          expect(error).toMatchObject({
            statusCode: 400,
            message: 'Email already exists',
          });
        });
    });

    it('should throw 422 error when inputs are invalid', async () => {
      await new UserService()
        .create({
          name: '',
          email: '',
          password: '',
        })
        .catch(error => {
          expect(error).toBeInstanceOf(Error.ValidationError);
          expect(error.errors).toMatchObject({
            name: expect.anything(),
            email: expect.anything(),
            password: expect.anything(),
          });
        });
    });

    it('should return user when inputs are valid', async () => {
      const inputs = {
        name: faker.name.fullName(),
        email: faker.internet.email(),
        password: '123456',
      } satisfies Partial<UserData>;

      const user = await new UserService().create(inputs);

      const newUser = await User.findById(user.id).select('password');

      const isPasswordHashed = await comparePassword(inputs.password, newUser?.password);

      expect(newUser).toBeDefined();
      expect(isPasswordHashed).toBeTruthy();
    });
  });
});
