/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  detectOpenHandles: true,
  moduleNameMapper: {
    "@src/(.*)": "<rootDir>/src/$1",
    "@resources/(.*)": "<rootDir>/src/resources/$1",
    "@middleware/(.*)": "<rootDir>/src/middleware/$1",
    "@utils/(.*)": "<rootDir>/src/utils/$1",
    "@test/(.*)": "<rootDir>/src/test/$1",
  },
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
  verbose: true,
};