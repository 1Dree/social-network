const mongoose = require("mongoose");
const RefreshTokenModel = require("../../models/RefreshTokenModel");
const jwt = require("jsonwebtoken");

const { generateAccessToken } = require("../../lib");

module.exports = async function renewAccess(req, res, next) {
  const { refreshtoken } = req.headers;

  if (!refreshtoken) {
    return res.status(400).json("No refreshToken was provided.");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const tokenDoc = await RefreshTokenModel.findOne(
      { token: refreshtoken },
      null,
      { session }
    );
    if (!tokenDoc) return res.sendStatus(404);

    await session.commitTransaction();
    session.endSession();

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
