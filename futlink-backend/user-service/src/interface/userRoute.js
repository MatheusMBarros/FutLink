// src/interface/userRoute.js

const express = require("express");
const userController = require("./userController");
const multer = require("multer");
const router = express.Router();

const Multer = multer({
	storage: multer.memoryStorage(),
	limits: 1024 * 1024,
});

// Rota de criação de usuário
router.post(
	"/users",
	Multer.single("profileImage"),
	userController.handleProfileImageUpload,
	userController.createUser
);

router.get("/users/:id", userController.getUser);

module.exports = router;
