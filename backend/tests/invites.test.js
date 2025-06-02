const request = require("supertest");
const app = require("../app");
const User = require("../models/User");
const Team = require("../models/Team");
const Invite = require("../models/Invite");

let tokenRemetente, tokenConvidado, remetenteId, convidadoId, teamId;

beforeEach(async () => {
  await User.deleteMany();
  await Team.deleteMany();
  await Invite.deleteMany();

  // Criador do time
  const remetente = await request(app).post("/api/users/register").send({
    nome: "Remetente",
    email: "remetente@email.com",
    senha: "123456",
    cidade: "Floripa",
    posicao: "Zagueiro",
  });

  const loginRemetente = await request(app).post("/api/users/login").send({
    email: "remetente@email.com",
    senha: "123456",
  });

  tokenRemetente = loginRemetente.body.token;
  remetenteId = loginRemetente.body.user.id;

  const team = await request(app)
    .post("/api/teams")
    .send({
      nome: "Time de Teste",
      criador: remetenteId,
      membros: [remetenteId],
    });

  teamId = team.body._id;

  // Convidado
  const convidado = await request(app).post("/api/users/register").send({
    nome: "Convidado",
    email: "convidado@email.com",
    senha: "123456",
    cidade: "Floripa",
    posicao: "Atacante",
  });

  const loginConvidado = await request(app).post("/api/users/login").send({
    email: "convidado@email.com",
    senha: "123456",
  });

  tokenConvidado = loginConvidado.body.token;
  convidadoId = loginConvidado.body.user.id;
});

describe("Convites para Time", () => {
  let conviteId;

  it("deve enviar convite para usuários", async () => {
    const res = await request(app).post(`/api/teams/${teamId}/invite`).send({
      identificador: "convidado@email.com",
      remetenteId,
    });

    expect(res.statusCode).toBe(200);
    conviteId = res.body._id;
  });

  it("deve listar convites pendentes do usuário", async () => {
    await request(app).post(`/api/teams/${teamId}/invite`).send({
      identificador: "convidado@email.com",
      remetenteId,
    });

    const res = await request(app).get(`/api/teams/invites/${convidadoId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("deve aceitar convite para entrar no time", async () => {
    await request(app).post(`/api/teams/${teamId}/invite`).send({
      identificador: "convidado@email.com",
      remetenteId,
    });

    const resp = await request(app).post("/api/users/login").send({
      email: "convidado@email.com",
      senha: "123456",
    });

    const convite = await request(app).get(
      `/api/teams/invites/${resp.body.user.id}`
    );
    const res = await request(app)
      .post(`/api/teams/invites/${convite.body[0]._id}/respond`)
      .send({
        action: "aceitar",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "Convite aceito com sucesso." });
  });
});
