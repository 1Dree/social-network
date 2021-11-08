const express = require("express");
const router = express.Router();
const chatControllers = require("../controllers/chat");

router.route("/send-message").put(chatControllers.sendMessage);
router.route("/retrieve-msgs").get(chatControllers.retrieveMsgs);

module.exports = router;
