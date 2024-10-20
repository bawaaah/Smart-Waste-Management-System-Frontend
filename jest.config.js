// jest.config.js
module.exports = {
  transform: {
    "^.+\\.jsx?$": "babel-jest", // Transform JavaScript and JSX files
  },
  moduleNameMapper: {
    "^axios$": "axios/dist/axios.min.js", // For handling axios import
  },
  testEnvironment: "jsdom", // Set the test environment to jsdom
};
