const express = require("express");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");

const router = express.Router();
const chatControls = require("../controllers/chat");
const { authorization, renewAccess } = require("../controllers/auth");

require("dotenv").config();

const storage = new GridFsStorage({
  url: process.env.MONGODB_URL,
  file: chatControls.toFile,
});
const upload = multer({ storage });

router.use(authorization, renewAccess);

router.route("/send-message").put(chatControls.sendMessage);
router.route("/retrieve-msgs").get(chatControls.retrieveMsgs);
router.route("/hide-msg").put(chatControls.hideMsg);
router
  .route("/upload-img")
  .post(upload.single("image"), chatControls.onImgUpload);
router.route("/delete-msg").delete(chatControls.deleteMsg);
router.route("/remove-friend").delete(chatControls.removeFriend);
router.route("/download-img").get(chatControls.downloadImg);

module.exports = router;
