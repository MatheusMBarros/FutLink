const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // destinatário
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // remetente
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    type: {
      type: String,
      enum: ["like", "comment", "nova-partida", "lembrete"],
      required: true,
    },
    message: { type: String },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);
