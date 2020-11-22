// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  clearMocks: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!pages/{_app,_document,_error}.{ts,tsx}',
    '!next-env.d.ts',
    '!<rootDir>/serviceWorker.js',
    '!<rootDir>/node_modules/',
  ],
  setupFilesAfterEnv: ['./jest.setup.js'],
  moduleNameMapper: {
    '^@pages/(.*)': '<rootDir>/pages/$1',
  },
};
