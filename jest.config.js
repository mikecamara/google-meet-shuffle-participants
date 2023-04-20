module.exports = {
    testEnvironment: 'jest-environment-jsdom',
    coverageThreshold: {
        global: {
          lines: 80,
          branches: 70,
          functions: 90,
          statements: 80,
        },
      },
  };
  