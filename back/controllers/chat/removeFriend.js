const mongoose = require("mongoose");
const UserModel = require("../../models/UserModel");
const RoomModel = require("../../models/RoomModel");

module.exports = async function removeFriend({ body, gfs, accessToken }, res) {
  const { userId, roomId, friendId } = body;
  if (!userId || !roomId || !friendId) return res.sendStatus(400);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { friends } = await UserModel.findByIdAndUpdate(
      userId,
      {
        $pull: { friends: { _id: friendId } },
      },
      {
        session,
        new: true,
        select: "-_id friends",
      }
    );

    await UserModel.findByIdAndUpdate(
      friendId,
      {
        $pull: { friends: { _id: userId } },
      },
      {
        session,
      }
    );

    await RoomModel.findByIdAndDelete(roomId, { session });

    const roomFiles = await gfs.find({ roomId }, { session }).toArray();

    if (roomFiles.length) {
      roomFiles.forEach(
        async ({ _id }) => await gfs.delete(new mongoose.Types.ObjectId(_id))
      );
    }

    await session.commitTransaction();
    session.endSession();

    res.json({ friends, accessToken });
  } catch (err) {
    await session.abortTransaction();
    console.log(err);
    res.status(400).json(err.message);
  }
};
