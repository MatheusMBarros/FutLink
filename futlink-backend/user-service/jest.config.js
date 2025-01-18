module.exports = {
  testEnvironment: "node",
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: ["**/controllers/**/*.js", "**/services/**/*.js"],
  coverageDirectory: "coverage",
};
