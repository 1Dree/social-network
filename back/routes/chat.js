const express = require("express");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");

const router = express.Router();
const chatControllers = require("../controllers/chat");
const { authorization, renewAccess } = require("../controllers/auth");

require("dotenv").config();

const storage = new GridFsStorage({
  url: process.env.MONGODB_URL,
  file: chatControllers.toFile,
});
const upload = multer({ storage });

router.use(authorization, renewAccess);

router.route("/send-message").put(chatControllers.sendMessage);
router.route("/retrieve-msgs").get(chatControllers.retrieveMsgs);
router.route("/hide-msg").put(chatControllers.hideMsg);
router.route("/delete-msg").delete(chatControllers.deleteMsg);
router
  .route("/upload-img")
  .post(upload.single("image"), chatControllers.onImgUpload);

module.exports = router;
