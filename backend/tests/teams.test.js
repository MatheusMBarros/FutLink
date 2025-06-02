const request = require("supertest");
const app = require("../app");
const User = require("../models/User");
const Team = require("../models/Team");
const Invite = require("../models/Invite");

let token;
let userId;
let teamId;

beforeEach(async () => {
  await User.deleteMany();
  await Team.deleteMany();
  await Invite.deleteMany();

  await request(app).post("/api/users/register").send({
    nome: "Criador",
    email: "criador@email.com",
    senha: "123456",
    cidade: "Florianópolis",
    posicao: "Zagueiro",
  });

  const loginRes = await request(app).post("/api/users/login").send({
    email: "criador@email.com",
    senha: "123456",
  });

  token = loginRes.body.token;
  userId = loginRes.body.user.id;

  const teamRes = await request(app)
    .post("/api/teams")
    .set("Authorization", `Bearer ${token}`)
    .send({
      nome: "Time Teste",
      criador: userId,
      membros: [userId],
    });

  teamId = teamRes.body._id;
});

describe("Times - Funcionalidades", () => {
  it("deve buscar um time por ID", async () => {
    const res = await request(app).get(`/api/teams/${teamId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(teamId);
  });

  it("deve buscar times por nome", async () => {
    const res = await request(app).get(`/api/teams/buscar?nome=Time`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("deve retornar os times de um usuário", async () => {
    const res = await request(app).get(`/api/teams/user/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body[0].criador).toBe(userId);
  });

  it("deve adicionar um membro ao time", async () => {
    await request(app).post("/api/users/register").send({
      nome: "Novo",
      email: "novo@email.com",
      senha: "123456",
      cidade: "Floripa",
      posicao: "Atacante",
    });

    const novoUsuario = await request(app).post("/api/users/login").send({
      email: "novo@email.com",
      senha: "123456",
    });

    const novoUserId = novoUsuario.body.user.id;

    const res = await request(app)
      .post(`/api/teams/${teamId}/add`)
      .send({ userId: novoUserId });

    expect(res.statusCode).toBe(200);
    expect(res.body.membros).toContain(novoUserId);
  });

  it("deve remover um membro do time", async () => {
    const res = await request(app)
      .post(`/api/teams/${teamId}/remove`)
      .send({ userId });

    expect(res.statusCode).toBe(200);
    expect(res.body.membros).not.toContain(userId);
  });
});
