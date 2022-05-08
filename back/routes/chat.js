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

router.use(
  // all except "download-file"
  /\/(retrieve-contacts|send-message|retrieve-msgs|hide-msg|upload-file|delete-msg|remove-friend)/,
  authorization
);

router.use(
  // all except "download-file" and "delete-msg"
  /\/(retrieve-contacts|send-message|retrieve-msgs|upload-file|remove-friend)/,
  renewAccess
);

router.route("/retrieve-contacts").get(chatControls.retrieveContacts);
router.route("/retrieve-msgs").get(chatControls.retrieveMsgs);
router
  .route("/upload-file")
  .post(upload.single("file"), chatControls.onFileUpload);
router.route("/delete-msg").delete(chatControls.deleteMsg);
router.route("/remove-friend").delete(chatControls.removeFriend);
router
  .route("/download-file")
  .get(chatControls.onDownloadFile, authorization, chatControls.downloadFile);

module.exports = router;
