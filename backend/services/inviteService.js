const User = require("../models/User");
const Invite = require("../models/Invite");
const Team = require("../models/Team");

const findUserByIdentifier = async (identificador) => {
  if (identificador.match(/^[0-9a-fA-F]{24}$/)) {
    return await User.findById(identificador);
  } else {
    return await User.findOne({ email: identificador.toLowerCase() }); // ← aqui
  }
};

const inviteUserToTeam = async ({ teamId, identificador, remetenteId }) => {
  const destinatario = await findUserByIdentifier(identificador);
  if (!destinatario) throw new Error("Usuário não encontrado.");

  const team = await Team.findById(teamId);
  if (!team) throw new Error("Time não encontrado.");

  const remetenteIsOwner = String(remetenteId) === String(team.criador);

  const direction = remetenteIsOwner ? "convite" : "solicitacao";

  const existingInvite = await Invite.findOne({
    team: teamId,
    destinatario: destinatario._id,
    remetente: remetenteId,
    status: "pendente",
    direction,
  });

  if (existingInvite)
    throw new Error("Já existe um convite ou solicitação pendente.");

  const newInvite = new Invite({
    team: teamId,
    remetente: remetenteId,
    destinatario: destinatario._id,
    direction,
  });

  await newInvite.save();
  return {
    message:
      direction === "convite"
        ? "Convite enviado com sucesso."
        : "Solicitação enviada com sucesso.",
  };
};

const getPendingInvites = async (userId) => {
  return await Invite.find({ destinatario: userId, status: "pendente" })
    .populate("team")
    .populate("remetente", "nome email");
};

const respondToInvite = async ({ inviteId, action }) => {
  const invite = await Invite.findById(inviteId);
  if (!invite) throw new Error("Convite não encontrado.");
  if (invite.status !== "pendente")
    throw new Error("Convite já foi respondido.");

  const team = await Team.findById(invite.team);
  if (!team) throw new Error("Time não encontrado.");

  let userToAdd;
  if (invite.direction === "solicitacao") {
    userToAdd = invite.remetente;
  } else if (invite.direction === "convite") {
    userToAdd = invite.destinatario;
  }

  if (action === "aceitar") {
    if (!team.membros.includes(userToAdd)) {
      team.membros.push(userToAdd);
      await team.save();
    }

    invite.status = "aceito";
  } else if (action === "recusar") {
    invite.status = "recusado";
  } else {
    throw new Error("Ação inválida. Use 'aceitar' ou 'recusar'.");
  }

  await invite.save();
  return { message: `Convite ${invite.status} com sucesso.` };
};

module.exports = {
  inviteUserToTeam,
  getPendingInvites,
  respondToInvite,
};
