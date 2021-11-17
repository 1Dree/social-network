const mongoose = require("mongoose");
const UserModel = require("../../models/UserModel");
const bcrypt = require("bcryptjs");

const { userCoreData } = require("../../lib");

module.exports = async function updateProfile({ body, accessToken }, res) {
  let { userData, updationData } = body;
  if (!userData || !updationData) return res.sendStatus(400);

  const upEntries = Object.entries(updationData);

  if (upEntries.some(([key, value]) => value === userData[key])) {
    return res.sendStatus(400);
  }

  updationData = upEntries.reduce((acc, [key, value]) => {
    if (value) acc[key] = value;

    return acc;
  }, {});

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userDoc = await UserModel.findOne({ email: userData.email }, null, {
      session,
    });
    if (!userDoc) return res.sendStatus(404);

    const passMatch = await bcrypt.compare(userData.password, userDoc.password);
    if (!passMatch) return res.status(400).json("wrong password");

    const userUpdatedDoc = await UserModel.findByIdAndUpdate(
      userDoc._id,
      {
        $set: { ...updationData },
      },
      { session, new: true }
    );

    await session.commitTransaction();
    session.endSession();

    res.json({
      userData: userCoreData(userUpdatedDoc),
      accessToken,
    });
  } catch (err) {
    await session.abortTransaction();

    console.log(err);
    res.status(400).json(err.message);
  }
};
