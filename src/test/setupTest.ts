import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import 'dotenv/config';
import { UserData } from '@src/resources/user/user.interface';
import UserFactory from '@src/resources/user/user.factory';
import signToken from '@src/utils/token/sign.token';

let mongod: unknown;

const isMongoMemoryReplSet = (replSet: unknown): replSet is MongoMemoryReplSet =>
  replSet instanceof MongoMemoryReplSet;

global.signedIn = async (data?: Partial<UserData>) => {
  const user = await new UserFactory().create(data);

  const token = signToken({ id: user.id });

  return { user, token };
};

beforeAll(async () => {
  mongod = await MongoMemoryReplSet.create();

  if (isMongoMemoryReplSet(mongod)) {
    const uri = mongod.getUri();

    mongoose.set('strictQuery', true);

    await mongoose.connect(uri, {
      dbName: process.env.MONGO_DB_NAME,
    });
  }
});

beforeEach(async () => {
  const regularSignedIn = await signedIn();
  const adminSignedIn = await signedIn({ role: 'admin' });

  global.regularUser = regularSignedIn.user;
  global.regularToken = regularSignedIn.token;
  global.adminUser = adminSignedIn.user;
  global.adminToken = adminSignedIn.token;
});

afterEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for await (let collection of collections) {
    collection.deleteMany({});
  }
});

afterAll(async () => {
  if (isMongoMemoryReplSet(mongod)) {
    await mongod.stop();
  }

  await mongoose.disconnect();

  await mongoose.connection.close();
});
