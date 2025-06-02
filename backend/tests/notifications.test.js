// tests/notifications.test.js
const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const User = require("../models/User");
const Notification = require("../models/Notifications");

let token;
let userId;

beforeAll(async () => {
  await User.deleteMany();
  await Notification.deleteMany();

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

  // cria uma notificação manualmente para o teste
  await Notification.create({
    user: userId,
    message: "Publicacao Curtida",
    type: "like",
  });
});

describe("Integração - Notificações", () => {
  it("deve retornar notificações do usuário", async () => {
    const res = await request(app).get(`/api/notification/${userId}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
