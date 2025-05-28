const Match = require("../models/Match");
const PlayerStats = require("../models/PlayerStats");

async function createMatch(data) {
  const match = new Match(data);
  await match.save();
  await match.populate("criador", "nome email");
  await match.populate("participantes", "nome email");
  return match;
}

async function getAllMatches() {
  return Match.find()
    .populate("criador", "nome email")
    .populate("participantes", "nome email");
}

async function getMatchById(id) {
  return Match.findById(id)
    .populate("criador", "nome email")
    .populate("participantes", "nome email");
}

async function getNearbyMatches(lat, lng, dist = 5000) {
  return Match.find({
    finalizada: false, // adiciona filtro para partidas não finalizadas
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [parseFloat(lng), parseFloat(lat)],
        },
        $maxDistance: parseInt(dist),
      },
    },
  })
    .populate("criador", "nome email")
    .populate("participantes", "nome email");
}

async function inscreverEmPartida(matchId, userId) {
  const match = await Match.findById(matchId);

  if (!match) {
    throw new Error("Partida não encontrada");
  }

  const jaInscrito = match.participantes.some(
    (id) => id && id.toString() === userId
  );

  if (jaInscrito) {
    throw new Error("Usuário já está inscrito nesta partida");
  }

  if (match.participantes.length >= match.vagas) {
    throw new Error("Partida já está com todas as vagas preenchidas");
  }

  match.participantes.push(userId);
  await match.save();

  await match.populate("criador", "nome email");
  await match.populate("participantes", "nome email");

  return match;
}

async function updateMatch(id, data) {
  return Match.findByIdAndUpdate(id, data, {
    new: true,
  })
    .populate("criador", "nome email")
    .populate("participantes", "nome email")
    .populate("mvp", "nome email");
}

async function removePlayerFromMatch(matchId, userId) {
  return Match.findByIdAndUpdate(
    matchId,
    { $pull: { participantes: userId } },
    { new: true }
  ).populate("participantes", "nome email");
}

async function setMatchMVP(matchId, userId) {
  return Match.findByIdAndUpdate(
    matchId,
    { mvp: userId },
    { new: true }
  ).populate("mvp", "nome email");
}

async function deleteMatch(id) {
  const match = await Match.findByIdAndDelete(id);
  if (!match) {
    throw new Error("Partida não encontrada");
  }
  return match;
}
async function getMatchesByCreator(userId) {
  return Match.find({ criador: userId })
    .populate("participantes", "nome email")
    .populate("criador", "nome email");
}

async function finalizarPartida(matchId, mvpId, stats = []) {
  const match = await Match.findById(matchId);
  if (!match) throw new Error("Partida não encontrada");

  if (match.finalizada) throw new Error("Partida já foi finalizada");

  // Marcar como finalizada
  match.finalizada = true;
  await match.save();

  // Salvar estatísticas de cada jogador
  for (const playerStat of stats) {
    const {
      userId,
      gols = 0,
      assistencias = 0,
      minutosJogador = 0,
      vitorias = false,
    } = playerStat;

    await PlayerStats.create({
      user: userId,
      match: matchId,
      gols,
      assistencias,
      minutosJogador,
      vitorias,
      mvp: userId === mvpId,
    });
  }

  return { matchId, mvpId };
}

module.exports = {
  createMatch,
  getAllMatches,
  getMatchById,
  getNearbyMatches,
  inscreverEmPartida,
  updateMatch,
  removePlayerFromMatch,
  setMatchMVP,
  deleteMatch,
  getMatchesByCreator,
  finalizarPartida,
};
