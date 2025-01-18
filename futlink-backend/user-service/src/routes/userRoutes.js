const express = require("express");
const multer = require("multer");
const UserController = require("../controllers/userController");

const router = express.Router();
const userController = new UserController();

// Configuração do multer para processar uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Rotas de usuários
router.post(
  "/", 
  upload.single("file"), // Aceitar o arquivo de upload enviado no campo "file"
  userController.createUser.bind(userController) // Associar o método de criação de usuário
);

router.get(
  "/", 
  userController.getAllUsers.bind(userController) // Obter todos os usuários
);

router.get(
  "/:id", 
  userController.getUserById.bind(userController) // Obter usuário por ID
);

router.put(
  "/:id", 
  upload.single("file"), // Aceitar atualização de arquivo enviado no campo "file"
  userController.updateUser.bind(userController) // Atualizar usuário
);

router.delete(
  "/:id", 
  userController.deleteUser.bind(userController) // Deletar usuário
);

module.exports = router;
