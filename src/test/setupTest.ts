import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import 'dotenv/config';

let mongod: unknown;

const isMongoMemoryReplSet = (replSet: unknown): replSet is MongoMemoryReplSet =>
  replSet instanceof MongoMemoryReplSet;

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
