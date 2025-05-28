const User = require("../models/User");

async function getUserById(userId) {
  const user = await User.findById(userId).select("-senha"); // evita retornar senha
  if (!user) {
    throw new Error("Usuário não encontrado");
  }
  return user;
}
async function updateUser(id, updates) {
  const user = await User.findByIdAndUpdate(id, updates, { new: true });
  if (!user) throw new Error("Usuário não encontrado");
  return user;
}

module.exports = { getUserById, updateUser };
