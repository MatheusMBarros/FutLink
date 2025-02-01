// src/interface/userController.js

const userService = require("../application/userService");

class UserController {
	createUser = async (req, res) => {
		try {
			const newUser = await userService.createUser(req.body);
			res.status(201).json(newUser);
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	};

	handleProfileImageUpload = async (req, res, next) => {
		try {
			const profileImage = await userService.uploadProfileImage(req.file);

			req.body.profileImageUri = profileImage.firebaseUrl;

			next();
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	};

	getUser = async (req, res) => {
		try {
			const { id } = req.params;
			const user = await userService.getUser(id);

			res.status(201).json(user);
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	};
}

module.exports = new UserController();
