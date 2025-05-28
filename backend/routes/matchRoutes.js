const express = require("express");
const router = express.Router();
// const authMiddleware = require("../middleware/authMiddleware"); // se quiser proteger
const matchController = require("../controllers/matchController");

// Criar partida
router.post("/", matchController.createMatch);

// Listar partidas
router.get("/", matchController.getAllMatches);

router.get("/nearby", matchController.getNearbyMatches); // 🔥 nova rota

// (Opcional) Buscar partida por ID
router.get("/:id", matchController.getMatchById);

router.post("/:matchId/inscrever", matchController.inscreverUsuario);

router.put("/:id", matchController.updateMatch);
router.delete("/:id/removePlayer", matchController.removePlayer);
router.post("/:id/mvp", matchController.setMVP);

router.delete("/:id", matchController.deleteMatch);
router.get("/creator/:userId", matchController.getByCreator);
router.post("/:id/finalizar", matchController.finalizarPartida);


module.exports = router;
