const express = require("express");
const router = express.Router();
const statsController = require("../controllers/statsController");

router.get("/:id", statsController.getUserStats);

module.exports = router;
