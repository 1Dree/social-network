const RefreshTokenModel = require("../../models/RefreshTokenModel");
const jwt = require("jsonwebtoken");

const { generateAccessToken, jwtVerifier } = require("../../lib");

module.exports = async function renewAccess(req, res, next) {
  const { refreshtoken, userid: userId } = req.headers;

  if (!refreshtoken) {
    return res.status(400).json("No refreshToken was provided.");
  }

  if (!userId) return res.status(400).json("No userId was provided.");

  try {
    const tokenDoc = await RefreshTokenModel.findOne({
      token: refreshtoken,
      userId,
    });
    if (!tokenDoc) return res.status(404).json("token not found");

    jwt.verify(tokenDoc.token, process.env.REFRESH_TOKEN_SECRET, err => {
      if (err) return res.status(403).json(err.message);

      const accessToken = generateAccessToken(userId);

      req.accessToken = accessToken;

      next();
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
};
