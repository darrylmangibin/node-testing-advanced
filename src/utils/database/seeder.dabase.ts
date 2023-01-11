import UserFactory from '@src/resources/user/user.factory';
import User from '@src/resources/user/user.model';
import 'colors';
import 'dotenv/config';
import connectDatabase from './connect.database';

class SeederDatabase {
  constructor() {
    if (process.env.NODE_ENV === 'development') {
      connectDatabase();
    }
  }

  public importData = async () => {
    try {
      console.log('Generating admin...'.green);
      const admin = await new UserFactory().create({
        email: 'admin@example.com',
        role: 'admin',
      });

      console.log('Generating users...'.green);
      const users = await new UserFactory().createMany(15);

      console.log('Data imported...'.green.bold);

      process.exit();
    } catch (error) {
      console.error(error);

      process.exit(1);
    }
  };

  public destroyData = async () => {
    try {
      const userCountDocuments = await User.countDocuments();
      console.log(`Deleting ${userCountDocuments} users...`.red);

      console.log('Data destroyed...'.red.bold);

      process.exit();
    } catch (error) {
      console.error(error);

      process.exit(1);
    }
  };
}

export default SeederDatabase;
