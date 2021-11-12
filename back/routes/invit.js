const express = require("express");
const router = express.Router();

const invitControllers = require("../controllers/invit");
const { authorization, renewAccess } = require("../controllers/auth");

router.use(authorization, renewAccess);

router.route("/send-invitation").put(invitControllers.sendInvitation);
router.route("/get-invitations").get(invitControllers.getInvitations);
router.route("/reject-invitation").delete(invitControllers.rejectInvitation);
router.route("/remove-invitation").delete(invitControllers.removeInvitation);
router.route("/accept-invitation").put(invitControllers.acceptInvitation);

module.exports = router;
