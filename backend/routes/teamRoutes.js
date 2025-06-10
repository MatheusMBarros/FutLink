// routes/teamRoutes.js
const express = require("express");
const router = express.Router();
const teamController = require("../controllers/teamController");

router.post("/", teamController.createTeam);
router.get("/user/:userId", teamController.getUserTeams);
router.post("/:teamId/add", teamController.addMember);
router.post("/:teamId/remove", teamController.removeMember);
router.post("/:teamId/invite", teamController.inviteMember);
router.get("/invites/:userId", teamController.getInvites);
router.get("/buscar", teamController.searchTeamByName);
router.post("/invites/:inviteId/respond", teamController.respondInvite);

router.get("/:id", teamController.getTeamById);
module.exports = router;
