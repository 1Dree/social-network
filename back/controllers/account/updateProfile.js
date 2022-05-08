const mongoose = require("mongoose");
const UserModel = require("../../models/UserModel");
const bcrypt = require("bcryptjs");

module.exports = async function updateProfile(
  { body, accessToken, headers },
  res
) {
  const { update } = body;
  const { userid } = headers;
  if (!update || !userid) return res.sendStatus(400);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const passHash = async password => {
      const salt = await bcrypt.genSalt(10);
      return bcrypt.hash(password, salt);
    };

    if (update.password) update.password = await passHash(update.password);

    const updateKeys = Object.keys(update);
    const loginUpdates = updateKeys.reduce((acc, key) => {
      acc[`login.${key}`] = update[key];

      return acc;
    }, {});
    const loginUpdatesKeysStr = Object.keys(loginUpdates)
      .join()
      .replace(/,|login\.password/g, " ");

    const userDoc = await UserModel.findByIdAndUpdate(
      userid,
      {
        $set: loginUpdates,
      },
      { session, new: true, select: `-_id ${loginUpdatesKeysStr}` }
    );

    if (update.name) {
      await UserModel.updateMany(
        { "friends._id": userid },
        { $set: { "friends.$.name": update.name } }
      );
    }

    await session.commitTransaction();
    session.endSession();

    const response = {
      tokens: { access: accessToken },
    };

    if (loginUpdatesKeysStr !== " ") response.login = userDoc.login;

    res.json(response);
  } catch (err) {
    await session.abortTransaction();

    console.log(err);
    res.status(400).json(err.message);
  }
};
