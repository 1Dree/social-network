const RefreshTokenModel = require("../../models/RefreshTokenModel");
const jwt = require("jsonwebtoken");
const { generateAccessToken } = require("../../lib");

module.exports = async function renewAccess(refreshToken, userId) {
  const tokenDoc = await RefreshTokenModel.findOne({
    token: refreshToken,
    userId,
  });
  if (!tokenDoc) throw new Error("Refresh token not found.");

  const data = jwt.verify(tokenDoc.token, process.env.REFRESH_TOKEN_SECRET);

  return generateAccessToken(data._id);
};
