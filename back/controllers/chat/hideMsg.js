const RoomModel = require("../../models/RoomModel");
const mongoose = require("mongoose");

module.exports = async function sendInvitation(req, res) {
  const { userId, roomId, messageId } = req.body;
  if (!roomId) return res.sendStatus(400);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const alreadyHidden = await RoomModel.findOne(
      {
        _id: roomId,
        "messages.hideFrom": userId,
      },
      null,
      { session }
    );
    if (alreadyHidden) {
      return res.status(400).json("This message is already hidden.");
    }

    const roomMessages = await RoomModel.findOneAndUpdate(
      { _id: roomId, "messages._id": messageId },
      { $push: { "messages.$.hideFrom": userId } },
      { session, new: true, select: "-_id messages" }
    );

    await session.commitTransaction();
    session.endSession();

    res.json(roomMessages);
  } catch (err) {
    session.abortTransaction();
    console.log(err);
    res.json(err.message);
  }
};
