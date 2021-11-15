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
    const userDoc = await UserModel.findOne({ email: userData.email }, null, {
      session,
      projection: "password friends",
    });
    if (!userDoc) return json.sendStatus(404);

    const { _id: userId, password: passHash, friends } = userDoc;
    const passMatch = await bcrypt.compare(userData.password, passHash);
    if (!passMatch) res.status(400).json("wrong password");

    await UserModel.findByIdAndDelete(userId, { session });
    await RefreshTokenModel.findOneAndDelete({ userId }, { session });

    if (friends.length) {
      friends.forEach(async ({ _id, roomId }) => {
        const friendDoc = await UserModel.findById(_id, null, { session });

        if (friendDoc) {
          await RoomModel.findByIdAndUpdate(
            roomId,
            {
              $push: {
                messages: {
                  type: "notification",
                  content: `${userData.name} não está mais no app.`,
                  from: userId,
                },
              },
            },
            { session }
          );
        } else {
          const roomFiles = await gfs.find({ roomId }, { session });

          if (roomFiles.length) {
            roomFiles.forEach(
              async ({ _id }) =>
                await gfs.delete(new mongoose.Types.ObjectId(_id))
            );
          }

          await RoomModel.findByIdAndDelete(roomId, { session });
        }
      });
    }

    await session.commitTransaction();
    session.endSession();

    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    await session.abortTransaction();
    res.status(400).json(err.message);
  }
};
