const mongoose = require("mongoose");

const inviteSchema = new mongoose.Schema(
  {
    team: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
    remetente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    destinatario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pendente", "aceito", "recusado"],
      default: "pendente",
    },
    direction: {
      type: String,
      enum: ["convite", "solicitacao"],
      required: true,
    }, // ← aqui
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invite", inviteSchema);
