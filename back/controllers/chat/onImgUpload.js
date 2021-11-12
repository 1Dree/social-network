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
          ownerId: query.ownerId,
        },
      },
      { session }
    );

    const message = {
      type: "file",
      content: file.filename,
      from: query.ownerId,
    };

    const { messages } = await RoomModel.findByIdAndUpdate(
      query.roomId,
      {
        $push: { messages: message },
      },
      { session, new: true, select: "-_id messages" }
    );

    await session.commitTransaction();
    session.endSession();

    res.json({
      // file,
      messages,
      // , accessToken
    });
  } catch (err) {
    session.abortTransaction();
    console.log(err);

    res.status(400).json(err.message);
  }
};
