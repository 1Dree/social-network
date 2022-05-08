const mongoose = require("mongoose");
const UserModel = require("../../models/UserModel");
const RefreshTokenModel = require("../../models/RefreshTokenModel");
const bcrypt = require("bcryptjs");

const assets = require("../../lib");

module.exports = async function login(req, res) {
  const loginData = req.body;
  if (!loginData.login) return res.sendStatus(400);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userDoc = await UserModel.findOne(
      { "login.email": loginData.login.email },
      null,
      {
        session,
        select: "login friends invitations mailbox",
      }
    );
    if (!userDoc) return res.status(404).json("user not found");

    const { _id, login, friends, invitations, mailbox } = userDoc;

    const passMatch = await bcrypt.compare(
      loginData.login.password,
      login.password
    );
    if (!passMatch) return res.status(404).json("wrong password");

    const accessToken = assets.generateAccessToken(userDoc._id);
    const { token } = await RefreshTokenModel.findOne(
      {
        userId: _id,
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
    res.status(400).json(err.message);
  }
};
