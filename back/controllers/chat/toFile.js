const crypto = require("crypto");
const path = require("path");

module.exports = async function toFile(req, file) {
  const isImageOrVideo = /^(image\/(jpeg|jpg|png)|video\/(webm|mp4|mp3))$/.test(
    file.mimetype
  );
  if (!isImageOrVideo) throw new Error("Wrong file type.");

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
