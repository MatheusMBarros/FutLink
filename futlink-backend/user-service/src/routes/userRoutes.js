// Express Router e Configuração de Upload
const UserController = require("../controllers/userController");
const express = require('express')
const multer = require('multer')
const router = express.Router();
const userController = new UserController();

const uploadMemoryStorage = multer.memoryStorage();
const upload = multer({ storage: uploadMemoryStorage });

// Rotas de Usuários
router.post("/", upload.single("file"), (req, res, next) => next(), userController.createUser.bind(userController));
router.get("/", userController.getAllUsers.bind(userController));
router.get("/:id", userController.getUserById.bind(userController));
router.put("/:id", upload.single("file"), userController.updateUser.bind(userController));
router.delete("/:id", userController.deleteUser.bind(userController));

module.exports = router;
