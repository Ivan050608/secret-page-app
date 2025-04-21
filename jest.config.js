// jest.config.js
module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    moduleNameMapper: {
      '\\.(css|scss|sass)$': 'identity-obj-proxy', // mock CSS files
      '^@/components/(.*)$': '<rootDir>/components/$1', // alias support
      '^@/lib/(.*)$': '<rootDir>/lib/$1', // support for lib alias
    },
    testPathIgnorePatterns: ['/node_modules/', '/.next/'],
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
    },
  };
  