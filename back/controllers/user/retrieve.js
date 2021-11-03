const mongoose = require("mongoose");
const UserModel = require("../../models/UserModel");
const RefreshTokenModel = require("../../models/RefreshTokenModel");

const { userCoreData } = require("../../lib");

module.exports = async function retrieve(req, res) {
  const { userId } = req.params;
  if (!userId) return res.sendStatus(400);

  // res.json({ userId });
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userDoc = await UserModel.findById(userId, null, { session });
    if (!userDoc) return res.sendStatus(404);

    const { token } = await RefreshTokenModel.findOne(
      {
        userId: userDoc._id,
      },
      null,
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.json({
      userData: userCoreData(userDoc),
      refreshToken: token,
    });
  } catch (err) {
    await session.abortTransaction();

    console.log(err);
    res.sendStatus(400);
  }
};
