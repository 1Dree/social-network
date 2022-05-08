const mongoose = require("mongoose");
const UserModel = require("../../models/UserModel");
const RefreshTokenModel = require("../../models/RefreshTokenModel");

const assets = require("../../lib");

module.exports = async function signup(req, res) {
  const loginData = req.body;
  if (!loginData.login) return res.sendStatus(400);

  // res.json({ login });
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [userDoc] = await UserModel.create(
      [{ ...loginData, mailbox: new mongoose.Types.ObjectId() }],
      {
        session,
        select: "login.name login.email login.profile mailbox",
      }
    );
    const [accessToken, refreshToken] = [
      assets.generateAccessToken(userDoc._id),
      assets.generateRefreshToken(userDoc._id),
    ];

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
      _id: userDoc._id,
      mailbox: userDoc.mailbox,
      login: userDoc.login,
      tokens: {
        access: accessToken,
        refresh: refreshToken,
      },
    });
  } catch (err) {
    await session.abortTransaction();
    console.log(err);
    res.status(400).json(err.message);
  }
};
