const express = require("express");
const router = express.Router();
// const authMiddleware = require("../middleware/authMiddleware"); // se quiser proteger
const notificationController = require("../controllers/notificationController");

// Criar partida
router.get("/:userId", notificationController.getNotifications);

module.exports = router;
