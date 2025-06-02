const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
  titulo: String,
  descricao: String,
  data: Date,
  horario: String, // Horário de início (ex: "19:00")
  duracao: Number, // Duração da partida em minutos
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

  tipoPartida: {
    type: String,
    enum: ["Jogo", "Treino", "Torneio"],
    required: true,
  },
  timeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: false,
  },
});

// Cria o índice geoespacial
matchSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Match", matchSchema);
