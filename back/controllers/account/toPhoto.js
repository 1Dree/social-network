const crypto = require("crypto");
const path = require("path");

module.exports = async function toFile(req, file) {
  return new Promise((resolve, reject) => {
    const cryptoCallBack = (err, buf) => {
      if (err) {
        return reject(err);
      }

      const filename = buf.toString("hex") + path.extname(file.originalname);
      const fileInfo = {
        filename,
        bucketName: "uploads",
      };

      resolve(fileInfo);
    };

    crypto.randomBytes(16, cryptoCallBack);
  });
};
