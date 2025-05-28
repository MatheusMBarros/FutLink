const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function registerUser({ nome, email, senha, posicao, cidade, range }) {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email já está em uso");
  }

  const hashedPassword = await bcrypt.hash(senha, 10);

  const user = new User({
    nome,
    email,
    senha: hashedPassword,
    posicao,
    cidade,
    range,
  });

  await user.save();
  return user;
}

async function loginUser({ email, senha }) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  const isMatch = await bcrypt.compare(senha, user.senha);
  if (!isMatch) {
    throw new Error("Senha incorreta");
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return {
    token,
    user: {
      id: user._id,
      nome: user.nome,
      email: user.email,
      posicao: user.posicao,
      cidade: user.cidade,
      range: user.range,
    },
  };
}

module.exports = {
  registerUser,
  loginUser,
};
