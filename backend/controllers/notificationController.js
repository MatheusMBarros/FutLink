const notificationService = require("../services/notificationService");

exports.getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: "Parâmetro userId é obrigatório" });
    }

    const notifications = await notificationService.getUserNotifications(
      userId
    );
    res.status(200).json(notifications);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erro ao buscar notificações", details: err.message });
  }
};
