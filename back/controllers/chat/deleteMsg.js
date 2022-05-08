const UserModel = require("../../models/UserModel");
const RoomModel = require("../../models/RoomModel");
const mongoose = require("mongoose");

module.exports = async function deleteMsg({ body, gfs }, res) {
  const { roomId, messageInfo } = body;
  if (!roomId || !messageInfo) return res.sendStatus(400);

  const session = await mongoose.startSession();
  session.startTransaction();

  const options = { session };

  try {
    await UserModel.findOneAndUpdate(
      { "friends.ltMsg.msgId": messageInfo._id },
      { $unset: { "friends.$.ltMsg": "" } },
      options
    );

    await RoomModel.findByIdAndUpdate(
      roomId,
      {
        $pull: { messages: { _id: messageInfo._id } },
      },
      options
    );

    if (messageInfo.type !== "text") {
      const [{ _id }] = await gfs
        .find({ roomId, filename: messageInfo.content }, options)
        .toArray();

      await gfs.delete(new mongoose.Types.ObjectId(_id));
    }

    await session.commitTransaction();
    session.endSession();
  } catch (err) {
    console.log(err);
    await session.abortTransaction();
    res.status(500).json(err.message);
  }
};
