module.exports = {
  testEnvironment: 'node',
  moduleDirectories: ['node_modules', '<rootDir>'],
  testMatch: ['**/__tests__/**/*.test.js'],
  setupFiles: ['<rootDir>/jest.setup.js'],
  testTimeout: 10000,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
  },
} 