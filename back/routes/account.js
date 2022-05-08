const express = require("express");
const router = express.Router();

const accountControls = require("../controllers/account");
const { authorization, renewAccess } = require("../controllers/auth");

const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");

require("dotenv").config();

const storage = new GridFsStorage({
  url: process.env.MONGODB_URL,
  file: accountControls.toPhoto,
});
const upload = multer({ storage });

router.route("/signup").post(accountControls.signup);
router.route("/login").post(accountControls.login);
router
  .route("/retrieve-user")
  .get(authorization, renewAccess, accountControls.retrieve);
router
  .route("/verify-access")
  .get(authorization, accountControls.onVerifiedAccess);
router
  .route("/update-profile")
  .put(authorization, renewAccess, accountControls.updateProfile);
router.route("/new-password").put(accountControls.newPassword);
router.route("/signout").delete(authorization, accountControls.signout);

router
  .route("/identification")
  .post(authorization, renewAccess, accountControls.identification);

router
  .route("/change-photo")
  .post(
    authorization,
    renewAccess,
    upload.single("file"),
    accountControls.changePhoto
  );

module.exports = router;
