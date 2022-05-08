const mongoose = require("mongoose");
const UserModel = require("../../models/UserModel");
const RoomModel = require("../../models/RoomModel");

module.exports = async function removeFriend({ body, gfs }, res) {
  const { userId, roomId, friendId } = body;
  if (!userId || !roomId || !friendId)
    return res.status(400).json("insufficient resources");

  const session = await mongoose.startSession();
  const update = userId => ({
    $pull: { friends: { _id: userId } },
  });
  const options = { session };

  try {
    await session.withTransaction(async () => {
      await UserModel.findByIdAndUpdate(userId, update(friendId), options);
      await UserModel.findByIdAndUpdate(friendId, update(userId), options);

      await RoomModel.findByIdAndDelete(roomId, options);

      const roomFiles = await gfs.find({ roomId }, options).toArray();

      if (roomFiles.length) {
        const gfsDeletions = roomFiles.map(({ _id }) =>
          gfs.delete(new mongoose.Types.ObjectId(_id))
        );

        await Promise.all(gfsDeletions);
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  } finally {
    await session.endSession();
  }
};
