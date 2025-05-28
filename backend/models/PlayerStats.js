const mongoose = require("mongoose");

const playerStatsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  match: { type: mongoose.Schema.Types.ObjectId, ref: "Match", required: true },
  gols: { type: Number, default: 0 },
  assistencias: { type: Number, default: 0 },
  vitorias: { type: Boolean },
  minutosJogador: { type: Number, default: 0 },
  mvp: { type: Boolean, default: false }, // novo
  data: { type: Date, default: Date.now },
});


module.exports = mongoose.model("PlayerStats", playerStatsSchema);
