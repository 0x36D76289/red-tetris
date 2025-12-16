module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  collectCoverageFrom: [
    "client/**/*.{js,jsx}",
    "server/**/*.js",
    "!**/node_modules/**",
    "!**/dist/**",
    "!**/coverage/**",
    "!client/index.js",
    "!server/index.js",
    "!client/redux/store.js",
    "!client/redux/reducers/index.js",
    "!client/components/GameBoard.js", // Complex component with timers/intervals, tested via integration
  ],
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 50,
      functions: 70,
      lines: 70,
    },
  },
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
};
