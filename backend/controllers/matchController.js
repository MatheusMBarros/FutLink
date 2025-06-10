const matchService = require("../services/matchService");

exports.createMatch = async (req, res) => {
  try {
    const match = await matchService.createMatchComNotificacoes(req.body);
    res.status(201).json(match);
  } catch (err) {
    console.error("Erro ao criar partida:", err);
    res
      .status(500)
      .json({ error: "Erro ao criar partida", details: err.message });
  }
};

exports.getAllMatches = async (req, res) => {
  try {
    const matches = await matchService.getAllMatches();
    res.json(matches);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erro ao buscar partidas", details: err.message });
  }
};

exports.getMatchesByTeam = async (req, res) => {
  try {
    const matches = await matchService.getMatchesByTeam(req.params.teamId);
    res.json(matches);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Erro ao buscar partidas do time", error: err.message });
  }
};

exports.getMatchById = async (req, res) => {
  try {
    const match = await matchService.getMatchById(req.params.id);
    if (!match) {
      return res.status(404).json({ error: "Partida não encontrada" });
    }
    res.json(match);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erro ao buscar partida", details: err.message });
  }
};

exports.getNearbyMatches = async (req, res) => {
  try {
    const { lat, lng, dist } = req.query;
    if (!lat || !lng) {
      return res
        .status(400)
        .json({ error: "Latitude e longitude são obrigatórias" });
    }

    const matches = await matchService.getNearbyMatches(lat, lng, dist);
    res.json(matches);
  } catch (err) {
    res.status(500).json({
      error: "Erro ao buscar partidas próximas",
      details: err.message,
    });
  }
};

exports.inscreverUsuario = async (req, res) => {
  try {
    const { matchId } = req.params;
    const { userId } = req.body;

    const partida = await matchService.inscreverEmPartida(matchId, userId);

    res
      .status(200)
      .json({ message: "Inscrição realizada com sucesso", partida });
  } catch (err) {
    console.error("Erro ao inscrever usuário:", err.message);
    res.status(400).json({ error: err.message });
  }
};

exports.updateMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedMatch = await matchService.updateMatch(id, req.body);
    res.json(updatedMatch);
  } catch (error) {
    console.error("Erro ao atualizar partida:", error);
    res.status(500).json({ error: "Erro ao atualizar partida" });
  }
};

exports.removePlayer = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const updatedMatch = await matchService.removePlayerFromMatch(id, userId);
    res.json({ message: "Jogador removido", match: updatedMatch });
  } catch (error) {
    console.error("Erro ao remover jogador:", error);
    res.status(500).json({ error: "Erro ao remover jogador" });
  }
};

exports.setMVP = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const match = await matchService.setMatchMVP(id, userId);
    res.json({ message: "MVP definido com sucesso", match });
  } catch (error) {
    console.error("Erro ao definir MVP:", error);
    res.status(500).json({ error: "Erro ao definir MVP" });
  }
};

exports.deleteMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMatch = await matchService.deleteMatch(id);
    res.json({ message: "Partida excluída com sucesso", match: deletedMatch });
  } catch (err) {
    console.error("Erro ao excluir partida:", err.message);
    res.status(500).json({ error: "Erro ao excluir partida" });
  }
};

exports.getByCreator = async (req, res) => {
  try {
    const { userId } = req.params;
    const matches = await matchService.getMatchesByCreator(userId);
    res.json(matches);
  } catch (error) {
    console.error("Erro ao buscar partidas do criador:", error);
    res.status(500).json({ error: "Erro ao buscar partidas do criador" });
  }
};

exports.finalizarPartida = async (req, res) => {
  try {
    const { id } = req.params;
    const { mvpId, stats } = req.body;

    const result = await matchService.finalizarPartida(id, mvpId, stats);

    res.json({ message: "Partida finalizada com sucesso", result });
  } catch (error) {
    console.error("Erro ao finalizar partida:", error);
    res.status(500).json({ error: "Erro ao finalizar partida" });
  }
};
