const express = require("express");
const router = express.Router();
const chatControllers = require("../controllers/chat");

router.route("/send-message").put(chatControllers.sendMessage);
router.route("/retrieve-msgs").get(chatControllers.retrieveMsgs);
router.route("/hide-msg").put(chatControllers.hideMsg);

module.exports = router;
