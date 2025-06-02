const teamService = require("../services/teamService");
const inviteService = require("../services/inviteService");

exports.createTeam = async (req, res) => {
  try {
    const team = await teamService.createTeam(req.body);
    res.status(201).json(team);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar time", details: err.message });
  }
};
exports.getTeamById = async (req, res) => {
  try {
    const team = await teamService.getTeamById(req.params.id);
    res.json(team);
  } catch (err) {
    res.status(404).json({ message: err.message || "Erro ao buscar time." });
  }
};

exports.searchTeamByName = async (req, res) => {
  const { nome } = req.query;
  if (!nome) {
    return res.status(400).json({ error: "Parâmetro 'nome' é obrigatório." });
  }

  try {
    const times = await teamService.searchTeamsByName(nome);
    res.json(times);
  } catch (err) {
    res.status(500).json({
      error: "Erro ao buscar time",
      details: err.message,
    });
  }
};

exports.getUserTeams = async (req, res) => {
  try {
    const teams = await teamService.getUserTeams(req.params.userId);
    res.json(teams);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erro ao buscar times", details: err.message });
  }
};

exports.addMember = async (req, res) => {
  try {
    const team = await teamService.addMemberToTeam(
      req.params.teamId,
      req.body.userId
    );
    res.json(team);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erro ao adicionar membro", details: err.message });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const team = await teamService.removeMemberFromTeam(
      req.params.teamId,
      req.body.userId
    );
    res.json(team);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erro ao remover membro", details: err.message });
  }
};

exports.getInvites = async (req, res) => {
  try {
    const { userId } = req.params;
    const invites = await inviteService.getPendingInvites(userId);
    res.status(200).json(invites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.respondInvite = async (req, res) => {
  try {
    const { inviteId } = req.params;
    const { action } = req.body;

    const result = await inviteService.respondToInvite({ inviteId, action });
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.inviteMember = async (req, res) => {
  try {
    const { identificador, remetenteId } = req.body;
    const { teamId } = req.params;

    const result = await inviteService.inviteUserToTeam({
      teamId,
      identificador,
      remetenteId,
    });

    res.status(200).json(result);
  } catch (err) {
    console.error("Erro ao enviar convite:", err.message);
    res.status(400).json({ message: err.message });
  }
};
