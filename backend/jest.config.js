/** @type {import('jest').Config} */
module.exports = {
  // ts-jest lets Jest run our .ts test files directly
  preset: 'ts-jest',
  // We are testing a server, not a browser page
  testEnvironment: 'node',
  // Only look for tests inside src/
  roots: ['<rootDir>/src'],
};
