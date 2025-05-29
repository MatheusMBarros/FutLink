const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Referência ao usuário que postou
    required: true,
  },
  content: {
    type: String,
    required: false,
  },
  mediaUrl: {
    type: String, // URL de imagem ou vídeo
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,
    enum: ["image", "video"],
    required: true,
  },
});

module.exports = mongoose.model("Post", postSchema);
