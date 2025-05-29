const express = require("express");
const router = express.Router();
const likeController = require("../controllers/likeController");

router.post("/", likeController.likePost);

module.exports = router;
