const RoomModel = require("../../models/RoomModel");
const mongoose = require("mongoose");

module.exports = async function retrieveMsgs({ body, gfs }, res) {
  const { roomId, messageInfo } = body;
  if (!roomId || !messageInfo) return res.sendStatus(400);

  try {
    const { messages } = await RoomModel.findByIdAndUpdate(
      roomId,
      {
        $pull: { messages: { _id: messageInfo._id } },
      },
      {
        new: true,
        select: "-_id messages",
      }
    );

    if (messageInfo.type === "file") {
      await gfs.delete(new mongoose.Types.ObjectId(messageInfo.fileId));
    }

    res.json({ messages });
  } catch (err) {
    console.log(err);
    res.json(err.message);
  }
};
