// filepath: /Users/jaimediaz/Labs/website-realstate-v3/jest.config.cjs
const path = require("path");

module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^@/(.*)$": "<rootDir>/$1", // Map @ to the root directory
  },
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": [
      "babel-jest",
      { configFile: "./babel-jest.config.cjs" },
    ],
  },
  transformIgnorePatterns: ["/node_modules/"],
};
