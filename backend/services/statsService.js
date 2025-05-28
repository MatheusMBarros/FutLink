const mongoose = require("mongoose");
const PlayerStats = require("../models/PlayerStats");

async function getUserStats(userId) {
  const objectId = new mongoose.Types.ObjectId(userId);
  const stats = await PlayerStats.find({ user: objectId });

  // Retorno padrão caso não existam estatísticas
  if (!stats || stats.length === 0) {
    return {
      gols: 0,
      assistencias: 0,
      minutos: 0,
      vitorias: 0,
      derrotas: 0,
      empates: 0,
      mvpCount: 0,
    };
  }

  let gols = 0;
  let assistencias = 0;
  let minutos = 0;
  let vitorias = 0;
  let derrotas = 0;
  let empates = 0;
  let mvpCount = 0;

  for (const s of stats) {
    gols += s.gols;
    assistencias += s.assistencias;
    minutos += s.minutosJogador || 0;

    if (s.vitorias === true) vitorias++;
    else if (s.vitorias === false) derrotas++;
    else empates++;

    if (s.mvp) mvpCount++;
  }

  return {
    gols,
    assistencias,
    minutos,
    vitorias,
    derrotas,
    empates,
    mvpCount,
  };
}

module.exports = {
  getUserStats,
};
