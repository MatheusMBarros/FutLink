const Notification = require("../models/Notifications");

const getUserNotifications = async (userId) => {
  try {
    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: 1 })
      .populate("from", "nome"); // aqui você popula o campo 'from' com o campo 'username' do usuário

    return notifications;
  } catch (error) {
    throw new Error("Erro ao buscar notificações do usuário: " + error.message);
  }
};

module.exports = {
  getUserNotifications,
};
