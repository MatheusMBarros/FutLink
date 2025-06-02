const express = require("express");
const router = express.Router();
const agenda = require("../config/agenda");

router.post("/test-lembrete", async (req, res) => {
  try {
    await agenda.now("enviar lembrete de partida", {
      matchId: "683ca145bc2d054ce8d5a3d0",
      message: "⚽️ Lembrete de teste disparado agora!",
    });

    res.json({
      success: true,
      message: "Lembrete de teste agendado para agora.",
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erro ao agendar teste", details: err.message });
  }
});

module.exports = router;
