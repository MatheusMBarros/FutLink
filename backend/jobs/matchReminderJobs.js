const DeviceToken = require("../models/DeviceToken");
const Notification = require("../models/Notifications");
const Match = require("../models/Match");
const fetch = require("node-fetch");

module.exports = async function (agenda) {
  agenda.define("enviar lembrete de partida", async (job) => {
    const { matchId, message } = job.attrs.data;

    try {
      const match = await Match.findById(matchId).populate("participantes");

      for (const user of match.participantes) {
        const device = await DeviceToken.findOne({ userId: user._id });
        if (!device?.token) continue;

        const payload = {
          to: device.token,
          sound: "default",
          title: "Lembrete de Partida",
          body: message,
          data: { matchId, type: "lembrete" },
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

        await Notification.create({
          user: user._id,
          match: matchId,
          type: "lembrete",
          message,
        });
      }
    } catch (err) {
      console.error("❌ Erro no lembrete de partida:", err.message);
    }
  });
  agenda.define("enviar lembrete individual", async (job) => {
    const { matchId, userId, message } = job.attrs.data;

    try {
      const device = await DeviceToken.findOne({ userId });
      if (!device?.token) return;

      const payload = {
        to: device.token,
        sound: "default",
        title: "Lembrete de Partida",
        body: message,
        data: { matchId, type: "lembrete" },
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

      await Notification.create({
        user: userId,
        match: matchId,
        type: "lembrete",
        message,
      });
    } catch (err) {
      console.error("❌ Erro ao enviar lembrete individual:", err.message);
    }
  });
};
