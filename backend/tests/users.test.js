const request = require("supertest");
const app = require("../app");
const User = require("../models/User");

describe("Usuários", () => {
  // Limpa a coleção de usuários após cada teste
  afterEach(async () => {
    await User.deleteMany({});
  });

  it("deve registrar um novo usuário", async () => {
    const res = await request(app).post("/api/users/register").send({
      nome: "Matheus",
      email: "matheus@email.com",
      senha: "123456",
      cidade: "florianopolis",
      posicao: "Goleiro",
    });

    expect(res.statusCode).toBe(201);
  });

  it("deve impedir registro com email duplicado", async () => {
    await User.create({
      nome: "Matheus",
      email: "matheus@email.com",
      senha: "123456",
    });

    const res = await request(app).post("/api/users/register").send({
      nome: "Outro",
      email: "matheus@email.com",
      senha: "senha123",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/email já está em uso/i);
  });

  it("deve fazer login com credenciais válidas", async () => {
    await request(app).post("/api/users/register").send({
      nome: "Matheus",
      email: "matheus@email.com",
      senha: "123456",
      cidade: "florianopolis",
      posicao: "Goleiro",
    });

    const res = await request(app).post("/api/users/login").send({
      email: "matheus@email.com",
      senha: "123456",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("deve rejeitar login com senha incorreta", async () => {
    await request(app).post("/api/users/register").send({
      nome: "Matheus",
      email: "matheus@email.com",
      senha: "123456",
      cidade: "florianopolis",
      posicao: "Goleiro",
    });

    const res = await request(app).post("/api/users/login").send({
      email: "matheus@email.com",
      senha: "senhaErrada",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.message || res.body.error).toMatch(/Senha incorreta/i);
  });
});
