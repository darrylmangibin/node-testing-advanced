/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  detectOpenHandles: true,
  moduleNameMapper: {
    "@src/(.*)": "./src/$1",
    "@resources/(.*)": "./src/resources/$1",
    "@middleware/(.*)": "./src/middleware/$1",
    "@utils/(.*)": "./src/utils/$1",
    "@test/(.*)": "./src/test/$1",
  },
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
  verbose: true,
  watchAll: true
};