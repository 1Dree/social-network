const mongoose = require("mongoose");
const UserModel = require("../../models/UserModel");
const RefreshTokenModel = require("../../models/RefreshTokenModel");
const bcrypt = require("bcryptjs");

const assets = require("../../lib");

module.exports = async function login(req, res) {
  const { userData } = req.body;
  if (!userData) return res.sendStatus(400);

  // res.json({ userData });
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userDoc = await UserModel.findOne({ email: userData.email }, null, {
      session,
    });
    if (!userDoc) return res.sendStatus(404);

    const passMatch = await bcrypt.compare(userData.password, userDoc.password);
    if (!passMatch) return res.sendStatus(404);

    const accessToken = assets.generateAccessToken(userDoc);
    const { token } = await RefreshTokenModel.findOne(
      {
        userId: userDoc._id,
      },
      null,
      { session }
    );

    res.json({
      userData: assets.userCoreData(userDoc),
      accessToken,
      refreshToken: token,
    });
  } catch (err) {
    await session.abortTransaction();

    console.log(err);
    res.status(400).json(err.message);
  }
};
