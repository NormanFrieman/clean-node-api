module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: "coverage",
  testEnvironment: "node",
  preset: '@shelf/jest-mongodb',
  watchPathIgnorePatterns: ['globalConfig.json'],
  transform: {
    '.+\\.ts$': 'ts-jest'
  }  
};
