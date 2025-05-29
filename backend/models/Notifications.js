const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // destino
  from: { type: String }, // nome de quem interagiu
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  type: { type: String, enum: ["like", "comment", "other"], required: true },
  message: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notification", notificationSchema);
