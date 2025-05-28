const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

// Rota de cadastro
router.post("/register", authController.register);

// Rota de login
router.post("/login", authController.login);

router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);



module.exports = router;
