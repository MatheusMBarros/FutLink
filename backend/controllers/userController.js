const userService = require("../services/userService");

exports.getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json(user);
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(404).json({ error: error.message });
  }
};


exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const user = await userService.updateUser(id, updates);
    res.json(user);
  } catch (err) {
    console.error("Erro ao atualizar usuário:", err.message);
    res.status(500).json({ error: err.message || "Erro ao atualizar usuário" });
  }
};

