const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const UserModel = require("../../models/UserModel");
const RefreshTokenModel = require("../../models/RefreshTokenModel");
const RoomModel = require("../../models/RoomModel");

module.exports = async function signout({ body, gfs }, res) {
  const { userData } = body;
  if (!userData) return res.sendStatus(400);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userDoc = await UserModel.findOne(
      { "login.email": userData.email },
      null,
      {
        session,
        projection: "login.password login.profile friends invitations",
      }
    );
    if (!userDoc) return res.status(404).json("user not found");

    const {
      _id: userId,
      login: { password: passHash, profile },
      friends,
      invitations: { sended, received },
    } = userDoc;
    const passMatch = await bcrypt.compare(userData.password, passHash);
    if (!passMatch) res.status(400).json("wrong password");

    await UserModel.findByIdAndDelete(userId, { session });
    await RefreshTokenModel.findOneAndDelete({ userId }, { session });

    if (profile !== "default") {
      const [userPhoto] = await gfs
        .find({ filename: profile }, { session })
        .toArray();

      await gfs.delete(new mongoose.Types.ObjectId(userPhoto._id));
    }

    const pullUser = arrayKey =>
      UserModel.updateMany(
        {},
        {
          $pull: {
            [arrayKey]: {
              _id: userId,
            },
          },
        },
        {
          session,
        }
      );

    if (friends.length) {
      await pullUser("friends");

      for ({ _id, chatRoom } of friends) {
        const roomFiles = await gfs
          .find({ roomId: chatRoom.toString() }, { session })
          .toArray();

        if (roomFiles.length) {
          const gfsDeletions = roomFiles.map(({ _id }) =>
            gfs.delete(new mongoose.Types.ObjectId(_id))
          );

          await Promise.all(gfsDeletions);
        }

        await RoomModel.findByIdAndDelete(chatRoom, { session });
      }
    }

    if (sended.length) await pullUser("invitations.received");

    if (received.length) await pullUser("invitations.sended");

    await session.commitTransaction();
    session.endSession();

    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    await session.abortTransaction();
    res.status(400).json(err.message);
  }
};
