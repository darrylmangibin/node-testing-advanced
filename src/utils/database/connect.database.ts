import mongoose from 'mongoose';
import 'dotenv/config';
import 'colors';

const connectDatabase = async (message?: string) => {
  try {
    mongoose.set('strictQuery', true);

    await mongoose.connect(`${process.env.MONGO_URI}`, {
      dbName: process.env.MONGO_DB_NAME,
    });

    if (message) {
      console.log(message.yellow.underline);
    }
  } catch (error) {
    console.error(error);

    process.exit();
  }
};

export default connectDatabase;
