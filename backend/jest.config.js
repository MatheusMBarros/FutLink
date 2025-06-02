module.exports = {
  testEnvironment: "node",
  setupFiles: ["<rootDir>/jest.env.js"], // carrega .env.test antes de tudo
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"], // setup de testes (cleanup, etc)
};
