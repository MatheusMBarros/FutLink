// tests/matches.test.js
const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const User = require("../models/User");
const Match = require("../models/Match");

let token;
let userId;
let matchId;

beforeAll(async () => {
  await User.deleteMany();
  await Match.deleteMany();

  const res = await request(app).post("/api/users/register").send({
    nome: "Matheus",
    email: "matheus@email.com",
    senha: "123456",
    cidade: "Florianópolis",
    posicao: "Goleiro",
  });

  const login = await request(app).post("/api/users/login").send({
    email: "matheus@email.com",
    senha: "123456",
  });

  token = login.body.token;
  userId = login.body.user.id;
});

describe("Integração - Matches", () => {
  beforeEach(async () => {
    const res = await request(app)
      .post("/api/matches")
      .send({
        titulo: "Partida Teste",
        descricao: "Amistoso",
        local: "Estádio Teste",
        cidade: "Florianópolis",
        data: "2025-12-31",
        horario: "20:00",
        duracao: 90,
        vagas: 10,
        tipo: "Futebol",
        tipoPartida: "Jogo",
        location: {
          type: "Point",
          coordinates: [-48.5, -27.6],
        },
      });

    matchId = res.body._id;
  });

  it("deve criar uma partida com sucesso", async () => {
    expect(matchId).toBeDefined();
  });

 
});
