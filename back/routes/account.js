const express = require("express");
const router = express.Router();

const accountControls = require("../controllers/account");
const { authorization, renewAccess } = require("../controllers/auth");

router.route("/signup").post(accountControls.signup);
router.route("/login").post(accountControls.login);
router
  .route("/update-profile")
  .put(authorization, renewAccess, accountControls.updateProfile);
router.route("/forget-password").put(accountControls.forgetPassword);
router
  .route("/retrieve/:userId")
  .get(authorization, renewAccess, accountControls.retrieve);
router
  .route("/retrieve-all")
  .get(authorization, renewAccess, accountControls.retrieveAll);

module.exports = router;
