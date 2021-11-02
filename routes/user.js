const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/user");

router.route("/signup").post(userControllers.signup);
router.route("/login").post(userControllers.login);
router.route("/update-profile").put(userControllers.updateProfile);

module.exports = router;
