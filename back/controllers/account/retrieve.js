const mongoose = require("mongoose");
const UserModel = require("../../models/UserModel");
const RefreshTokenModel = require("../../models/RefreshTokenModel");

module.exports = async function retrieve({ query, accessToken }, res) {
  const { userid } = query;
  if (!userid) return res.sendStatus(400);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userDoc = await UserModel.findById(userid, null, { session });
    if (!userDoc) return res.sendStatus(404);

    const { _id, mailbox, friends, login, invitations } = userDoc;

    const { token } = await RefreshTokenModel.findOne(
      {
        userId: userid,
      },
      null,
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.json({
      _id,
      mailbox,
      login: { name: login.name, email: login.email, profile: login.profile },
      friends,
      invitations,
      tokens: {
        access: accessToken,
        refresh: token,
      },
    });
  } catch (err) {
    await session.abortTransaction();

    console.log(err);
    res.sendStatus(400);
  }
};
