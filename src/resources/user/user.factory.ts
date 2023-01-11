import { faker } from '@faker-js/faker';

import FactoryDatabase from '@src/utils/database/factory.database';
import { UserData, UserDocument } from './user.interface';
import User from './user.model';

class UserFactory extends FactoryDatabase<UserDocument, UserData> {
  public model = User;

  public data = async (arg?: Partial<UserData>) => {
    return {
      name: faker.name.fullName(),
      email: faker.internet.email(),
      password: '123456',
      role: 'user',
      ...arg,
    } satisfies UserData;
  };
}

export default UserFactory;
