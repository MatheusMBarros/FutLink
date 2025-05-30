const DeviceToken = require("../models/DeviceToken");
const Notification = require("../models/Notifications");
const fetch = require("node-fetch");

async function notifyUserInteraction({
  toUserId,
  fromUserId,
  fromUserName,
  type,
  postId,
}) {
  if (!toUserId || !fromUserId || !postId || !type) return;

  // Garante que não duplique notificações
  const alreadyExists = await Notification.findOne({
    user: toUserId,
    from: fromUserId,
    post: postId,
    type,
  });

  if (alreadyExists) return;

  const device = await DeviceToken.findOne({ userId: toUserId });
  if (!device?.token) return;

  const message =
    type === "like"
      ? `${fromUserName} curtiu seu post.`
      : `${fromUserName} comentou no seu post.`;

  const payload = {
    to: device.token,
    sound: "default",
    title: "FutLink",
    body: message,
    data: { postId, type },
  };

  try {
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

    await Notification.create({
      user: toUserId,
      from: fromUserId,
      post: postId,
      type,
      message,
    });
  } catch (err) {
    console.error("❌ Erro ao enviar/salvar notificação:", err.message);
  }
}

module.exports = notifyUserInteraction;
