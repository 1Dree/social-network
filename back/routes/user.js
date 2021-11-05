const express = require("express");
const router = express.Router();

const userControllers = require("../controllers/user");

router.route("/signup").post(userControllers.signup);
router.route("/login").post(userControllers.login);
router.route("/update-profile").put(userControllers.updateProfile);
router.route("/forget-password").put(userControllers.forgetPassword);
router.route("/retrieve/:userId").get(userControllers.retrieve);
router.route("/retrieve-all").get(userControllers.retrieveAll);
router.route("/send-invitation").put(userControllers.sendInvitation);
router.route("/get-invitations").get(userControllers.getInvitations);
router.route("/reject-invitation").delete(userControllers.rejectInvitation);
router.route("/remove-invitation").delete(userControllers.removeInvitation);

module.exports = router;
