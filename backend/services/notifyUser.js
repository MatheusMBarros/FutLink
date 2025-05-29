const DeviceToken = require("../models/DeviceToken");
const Notification = require("../models/Notifications");
const fetch = require("node-fetch");

async function notifyUserInteraction({ toUserId, fromUserName, type, postId }) {
  const device = await DeviceToken.findOne({ userId: toUserId });
  if (!device?.token) return;

  const message =
    type === "like"
      ? `${fromUserName} curtiu seu post.`
      : `${fromUserName} comentou no seu post.`;

  // Payload para notificação via Expo
  const payload = {
    to: device.token,
    sound: "default",
    title: "FutLink",
    body: message,
    data: { postId, type },
  };

  try {
    // Envia notificação via Expo
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const json = await response.json();

    // Salva no banco para exibir no app
    await Notification.create({
      userId: toUserId,
      from: fromUserName,
      post: postId,
      type,
      message,
    });
  } catch (err) {
    console.error("❌ Erro ao enviar ou salvar notificação:", err.message);
  }
}

module.exports = notifyUserInteraction;
