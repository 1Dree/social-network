const mongoose = require("mongoose");
const RoomModel = require("../../models/RoomModel");
const UserModel = require("../../models/UserModel");

module.exports = async function sendMessage(data) {
  if (!data.room || !data.message || !data.friendId || !data.ltMsg)
    throw new Error("insufficient resouces");

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { messages } = await RoomModel.findByIdAndUpdate(
      data.room,
      {
        $push: { messages: data.message },
      },
      { select: "-_id messages", new: true }
    );

    const thisMsg = messages.filter(
      ({ _id }) => _id.toString() === data.message._id
    )[0];

    await UserModel.findOneAndUpdate(
      { _id: data.friendId, "friends._id": data.ltMsg.author },
      {
        $set: {
          "friends.$.ltMsg": { ...data.ltMsg, updatedAt: thisMsg.updatedAt },
        },
      },
      { session, new: true }
    );

    const {
      friends: [{ ltMsg }],
    } = await UserModel.findOne(
      { _id: data.friendId, "friends._id": data.ltMsg.author },
      "-_id friends.$",
      {
        session,
      }
    );

    await session.commitTransaction();
    session.endSession();

    return {
      thisMsg,
      ltMsg,
    };
  } catch (err) {
    await session.abortTransaction();
    throw new Error(err.message);
  }
};
