const express = require("express");
const router = express.Router();

const invitControls = require("../controllers/invit");
const { authorization, renewAccess } = require("../controllers/auth");

router.use(authorization, renewAccess);

router.route("/send-invitation").put(invitControls.sendInvitation);
router.route("/get-invitations").get(invitControls.getInvitations);
router.route("/reject-invitation").delete(invitControls.rejectInvitation);
router.route("/remove-invitation").delete(invitControls.removeInvitation);
router.route("/accept-invitation").put(invitControls.acceptInvitation);

module.exports = router;
