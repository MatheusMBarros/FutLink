const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  token: String,
});

module.exports = mongoose.model("DeviceToken", schema);
