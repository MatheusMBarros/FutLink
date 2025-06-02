// services/notifyNewMatch.js
const DeviceToken = require("../models/DeviceToken");
const Notification = require("../models/Notifications");
const fetch = require("node-fetch");
const Team = require("../models/Team");
const User = require("../models/User");

async function notifyNewMatch({ teamId, matchId, matchDate, criadorId }) {
  try {
    const team = await Team.findById(teamId).populate("membros", "nome");

    if (!team || !team.membros.length) return;

    const criador = await User.findById(criadorId);

    // ✅ Agrupar por userId único
    const membrosUnicos = new Map();
    for (const membro of team.membros) {
      const id = membro._id.toString();
      if (id !== criadorId.toString()) {
        membrosUnicos.set(id, membro);
      }
    }

    for (const [membroId, membro] of membrosUnicos) {
      const jaExiste = await Notification.findOne({
        user: membroId,
        match: matchId,
        type: "nova-partida",
      });

      if (jaExiste) continue;

      const device = await DeviceToken.findOne({ userId: membroId });
      if (device && device.token) {
        const payload = {
          to: device.token,
          sound: "default",
          title: "Nova Partida Criada",
          body: `${criador.nome} marcou uma nova partida!`,
          data: {
            matchId,
            type: "nova-partida",
          },
        };

        await fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Accept-encoding": "gzip, deflate",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      }

      await Notification.create({
        user: membroId,
        from: criadorId,
        match: matchId,
        type: "nova-partida",
        message: `${criador.nome} marcou uma nova partida no seu time.`,
      });
    }
  } catch (err) {
    console.error("❌ Erro ao notificar nova partida:", err.message);
  }
}

module.exports = notifyNewMatch;
