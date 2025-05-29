// services/notifi.js

const Notification = require("../models/Notifications"); // ajuste o caminho conforme seu projeto

const getUserNotifications = async (userId) => {
  try {
    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 }) // ordena da mais recente para a mais antiga
      .populate("from", "username") // opcional: popula dados do remetente
      .populate("post"); // opcional: popula dados do post (se aplicável)

    return notifications;
  } catch (error) {
    throw new Error("Erro ao buscar notificações do usuário: " + error.message);
  }
};

module.exports = {
  getUserNotifications,
};
