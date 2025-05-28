const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nome: String,
  email: { type: String, unique: true },
  senha: String,
  posicao: String,
  cidade: String,
  range: { type: Number, default: 5000 },
});

module.exports = mongoose.model("User", userSchema);
