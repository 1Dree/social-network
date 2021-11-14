const mongoose = require("mongoose");
const UserModel = require("../../models/UserModel");
const RefreshTokenModel = require("../../models/RefreshTokenModel");

module.exports = async function signup({ body }, res) {
  const { userData } = body;
  if (!userData) return res.sendStatus(400);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { _id: userId, password: passHash } = await UserModel.findOne(
      { email: userData.email },
      { session, projection: "password" }
    );
    const passMatch = await bcprypt.compare(userData.password, passHash);
    if (!passMatch) res.status(400).json("wrong password");

    await UserModel.findByIdAndDelete(userId, { session });
    await RefreshTokenModel.findOneAndDelete({ userId }, { session });

    await session.commitTransaction();
    session.endSession();

    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    session.abortTransaction();
    res.status(400).json(err.message);
  }
};
