const mongoose = require("mongoose");
const RoomModel = require("../../models/RoomModel");

module.exports = async function onImgUpload(
  { file, query, db, accessToken },
  res
) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await db.collection("uploads.files").updateOne(
      { filename: file.filename },
      {
        $set: {
          originalname: file.originalname,
          ownerId: query.userId,
          roomId: query.chatRoom,
        },
      },
      { session }
    );

    const message = {
      _id: new mongoose.Types.ObjectId(),
      type: query.type,
      content: file.filename,
      author: query.userId,
    };

    if (query.subtitle) {
      message.subtitle = query.subtitle;
    }

    const { messages } = await RoomModel.findByIdAndUpdate(
      query.chatRoom,
      {
        $push: { messages: message },
      },
      { session, new: true, select: "-_id messages" }
    );

    await session.commitTransaction();
    session.endSession();

    res.json({
      messageDoc: messages.filter(
        ({ _id }) => _id.toString() === message._id.toString()
      )[0],
      accessToken,
    });
  } catch (err) {
    await session.abortTransaction();
    console.log(err);
    res.status(400).json(err.message);
  }
};
