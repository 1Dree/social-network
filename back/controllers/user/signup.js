const mongoose = require("mongoose");
const UserModel = require("../../models/UserModel");
const RefreshTokenModel = require("../../models/RefreshTokenModel");

const assets = require("../../lib");

module.exports = async function signup(req, res) {
  const { userData } = req.body;
  if (!userData) return res.sendStatus(400);

  //   res.json({ userData });
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [userDoc] = await UserModel.create([userData], { session });
    const accessToken = assets.generateAccessToken(userDoc);
    const refreshToken = assets.generateRefreshToken(userDoc);

    await RefreshTokenModel.create(
      [
        {
          userId: userDoc._id,
          token: refreshToken,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.json({
      userData: assets.userCoreData(userDoc),
      accessToken,
      refreshToken,
    });
  } catch (err) {
    session.abortTransaction();
    console.log(err);
    res.status(400).json(err.message);
  }
};
