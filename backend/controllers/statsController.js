const playerStatsService = require("../services/statsService");

exports.getUserStats = async (req, res) => {
  try {
    const { id } = req.params;
    const stats = await playerStatsService.getUserStats(id);
    res.json(stats);
  } catch (err) {
    console.error("Erro ao buscar estatísticas:", err);
    res.status(500).json({ error: "Erro ao buscar estatísticas do jogador" });
  }
};
