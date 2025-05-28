const authService = require("../services/authService");

exports.register = async (req, res) => {
  try {
    await authService.registerUser(req.body);
    res.status(201).json({ message: "Usuário registrado com sucesso" });
  } catch (err) {
    const status = err.message === "Email já está em uso" ? 400 : 500;
    res.status(status).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const result = await authService.loginUser(req.body);
    res.json(result);
  } catch (err) {
    let status = 500;
    if (err.message === "Usuário não encontrado") status = 404;
    if (err.message === "Senha incorreta") status = 401;
    res.status(status).json({ error: err.message });
  }
};
