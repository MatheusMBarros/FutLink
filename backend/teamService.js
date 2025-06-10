const Team = require("../models/Team");

async function createTeam({ nome, criador }) {
  const team = new Team({
    nome,
    criador,
    membros: [criador],
  });
  return await team.save();
}

async function getUserTeams(userId) {
  return await Team.find({ membros: userId }).populate("membros", "nome email");
}

async function addMemberToTeam(teamId, userId) {
  const team = await Team.findById(teamId);
  if (!team) throw new Error("Time não encontrado");

  if (!team.membros.includes(userId)) {
    team.membros.push(userId);
    await team.save();
  }

  return team;
}

async function removeMemberFromTeam(teamId, userId) {
  const team = await Team.findById(teamId);
  if (!team) throw new Error("Time não encontrado");

  team.membros = team.membros.filter((id) => id.toString() !== userId);
  await team.save();

  return team;
}

async function searchTeamsByName(nome) {
  return Team.find({
    nome: { $regex: nome, $options: "i" }, // busca case-insensitive
  }).limit(10);
}
const getTeamById = async (teamId) => {
  const team = await Team.findById(teamId).populate("membros", "nome email");
  if (!team) throw new Error("Time não encontrado.");
  return team;
};

module.exports = {
  getTeamById,
  createTeam,
  getUserTeams,
  addMemberToTeam,
  removeMemberFromTeam,
  searchTeamsByName,
};
