const express = require("express");
const router = express.Router();

const invitControls = require("../controllers/invit");
const { authorization, renewAccess } = require("../controllers/auth");

router
  .route("/get-invitations/:userId")
  .get(authorization, renewAccess, invitControls.getInvitations);

module.exports = router;
