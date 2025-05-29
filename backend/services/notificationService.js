const Notification = require("../models/Notifications");

const getUserNotifications = async (userId) => {
  try {
    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("from", "username avatar") // populando campos úteis
      .populate("post");

    return notifications;
  } catch (error) {
    throw new Error("Erro ao buscar notificações do usuário: " + error.message);
  }
};

module.exports = {
  getUserNotifications,
};
