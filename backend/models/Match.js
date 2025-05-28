const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
  titulo: String,
  descricao: String,
  data: Date,
  horario: String, // Horário de início (ex: "19:00")
  duracao: Number, // <-- Novo campo: duração da partida em minutos
  local: String,
  cidade: String,
  criador: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  participantes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  tipo: String,
  vagas: Number,
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  mvp: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  finalizada: { type: Boolean, default: false },
});

// Cria o índice geoespacial
matchSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Match", matchSchema);
