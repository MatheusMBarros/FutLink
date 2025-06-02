// tests/setup.js
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();

  // Conecta o mongoose à instância em memória
  await mongoose.connect(uri);
});

afterEach(async () => {
  // Limpa todas as coleções após cada teste
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.dropDatabase(); // limpa banco
  await mongoose.disconnect(); // encerra mongoose
  await mongo.stop(); // encerra MongoMemoryServer
});
