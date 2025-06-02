const Match = require("../models/Match");
const PlayerStats = require("../models/PlayerStats");
const notifyNewMatch = require("./notifyNewMatch");
const agenda = require("../config/agenda");

async function createMatchComNotificacoes(data) {
  const match = new Match(data);
  await match.save();
  await match.populate("criador", "nome email");
  await match.populate("participantes", "nome email");

  if (data.timeId) {
    await notifyNewMatch({
      teamId: data.timeId,
      matchId: match._id,
      matchDate: match.data,
      criadorId: data.criador || data.userId,
    });

    const [horaStr, minutoStr] = match.horario.split(":");
    const horaPartida = new Date(match.data);
    horaPartida.setHours(parseInt(horaStr, 10));
    horaPartida.setMinutes(parseInt(minutoStr, 10));
    horaPartida.setSeconds(0);
    horaPartida.setMilliseconds(0);

    const umaHoraAntes = new Date(horaPartida.getTime() - 60 * 60 * 1000);
    const cincoMinAntes = new Date(horaPartida.getTime() - 5 * 60 * 1000);
    const agora = new Date();

    if (umaHoraAntes > agora) {
      await agenda.schedule(umaHoraAntes, "enviar lembrete de partida", {
        matchId: match._id,
        message: "Sua partida começa em 1 hora!",
      });
    }

    if (cincoMinAntes > agora) {
      await agenda.schedule(cincoMinAntes, "enviar lembrete de partida", {
        matchId: match._id,
        message: "Sua partida começa em 5 minutos!",
      });
    } 
  } 

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
    finalizada: false,
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

  if (!match) throw new Error("Partida não encontrada");

  const jaInscrito = match.participantes.some(
    (id) => id?.toString() === userId
  );

  if (jaInscrito) throw new Error("Usuário já está inscrito nesta partida");

  if (match.participantes.length >= match.vagas) {
    throw new Error("Partida já está com todas as vagas preenchidas");
  }

  match.participantes.push(userId);
  await match.save();

  // Agendar lembretes para este usuário
  try {
    const [horaStr, minutoStr] = match.horario.split(":");
    const horaPartida = new Date(match.data);
    horaPartida.setHours(parseInt(horaStr, 10));
    horaPartida.setMinutes(parseInt(minutoStr, 10));
    horaPartida.setSeconds(0);
    horaPartida.setMilliseconds(0);

    const umaHoraAntes = new Date(horaPartida.getTime() - 60 * 60 * 1000);
    const cincoMinAntes = new Date(horaPartida.getTime() - 5 * 60 * 1000);
    const agora = new Date();

    const lembretes = [
      { time: umaHoraAntes, message: "⏰ Sua partida começa em 1 hora!" },
      { time: cincoMinAntes, message: "⚽️ Sua partida começa em 5 minutos!" },
    ];

    for (const { time, message } of lembretes) {
      if (time <= agora) {
      
        continue;
      }

      const jobsExistentes = await agenda.jobs({
        name: "enviar lembrete individual",
        "data.matchId": matchId,
        "data.userId": userId,
        "data.message": message,
      });

      if (jobsExistentes.length > 0) {
    
        continue;
      }

      await agenda.schedule(time, "enviar lembrete individual", {
        matchId,
        userId,
        message,
      });

     
    }
  } catch (err) {
    console.error(
      "❌ Erro ao agendar lembretes para novo inscrito:",
      err.message
    );
  }

  return await Match.findById(matchId)
    .populate("criador", "nome email")
    .populate("participantes", "nome email");
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

  match.finalizada = true;
  await match.save();

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

const getMatchesByTeam = async (teamId) => {
  return await Match.find({ timeId: teamId, finalizada: false }).sort({
    data: -1,
  });
};

module.exports = {
  getMatchesByTeam,
  createMatchComNotificacoes,
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
