export default {
  transform: {},
  testMatch: ["**/tests/**/*.test.js"],
  testEnvironment: "node",
  collectCoverageFrom: [
    "services/**/*.js",
    "middleware/**/*.js",
    "utilityFuncs/**/*.js",
    "models/**/*.js",
  ],
}
