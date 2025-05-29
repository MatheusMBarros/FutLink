const express = require("express");
const router = express.Router();
const DeviceToken = require("../models/DeviceToken");

router.post("/", async (req, res) => {
  const { userId, token } = req.body;
  try {
    await DeviceToken.findOneAndUpdate(
      { userId },
      { token },
      { upsert: true, new: true }
    );
    res.sendStatus(200);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erro ao salvar token", details: err.message });
  }
});

module.exports = router;
