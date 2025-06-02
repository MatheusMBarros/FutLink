const mongoose = require("mongoose");
const PlayerStats = require("../../models/PlayerStats");
const { getUserStats } = require("../../services/statsService");

jest.mock("../../models/PlayerStats");

describe("Serviço de Estatísticas", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar estatísticas padrão se não houver dados", async () => {
    PlayerStats.find.mockResolvedValue([]);

    const result = await getUserStats("507f1f77bcf86cd799439011");

    expect(result).toEqual({
      gols: 0,
      assistencias: 0,
      minutos: 0,
      vitorias: 0,
      derrotas: 0,
      empates: 0,
      mvpCount: 0,
    });
  });

  it("deve calcular corretamente as estatísticas do jogador", async () => {
    const mockStats = [
      {
        gols: 2,
        assistencias: 1,
        minutosJogador: 60,
        vitorias: true,
        mvp: true,
      },
      {
        gols: 1,
        assistencias: 2,
        minutosJogador: 45,
        vitorias: false,
        mvp: false,
      },
      {
        gols: 0,
        assistencias: 1,
        minutosJogador: 30,
        vitorias: null,
        mvp: true,
      },
    ];

    PlayerStats.find.mockResolvedValue(mockStats);

    const result = await getUserStats("507f1f77bcf86cd799439011");

    expect(result).toEqual({
      gols: 3,
      assistencias: 4,
      minutos: 135,
      vitorias: 1,
      derrotas: 1,
      empates: 1,
      mvpCount: 2,
    });
  });
});
