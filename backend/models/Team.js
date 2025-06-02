// models/Team.js
const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
    },
    criador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    membros: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Team", teamSchema);
