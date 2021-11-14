const RefreshTokenModel = require("../../models/RefreshTokenModel");
const jwt = require("jsonwebtoken");

const { generateAccessToken } = require("../../lib");

module.exports = async function renewAccess(req, res, next) {
  const { refreshtoken, userid: userId } = req.headers;

  if (!refreshtoken) {
    return res.status(400).json("No refreshToken was provided.");
  }

  if (!userId) return res.sendStatus(400);

  try {
    const tokenDoc = await RefreshTokenModel.findOne({
      token: refreshtoken,
      userId,
    });
    if (!tokenDoc) return res.sendStatus(404);

    jwt.verify(
      tokenDoc.token,
      process.env.REFRESH_TOKEN_SECRET,
      (err, data) => {
        if (err) {
          console.log(err);

          return res.status(403).json(err.message);
        }

        const accessToken = generateAccessToken(data);

        req.accessToken = accessToken;

        next();
      }
    );
  } catch (err) {
    session.abortTransaction();

    console.log(err);
    res.status(400).json(err.message);
  }
};
