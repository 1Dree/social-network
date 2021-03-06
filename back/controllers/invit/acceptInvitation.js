const UserModel = require("../../models/UserModel");
const RoomModel = require("../../models/RoomModel");
const mongoose = require("mongoose");

module.exports = async function acceptInvitation({ body, accessToken }, res) {
  const { userData, inviterData } = body;
  if (!userData || !inviterData) return res.sendStatus(400);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = userData._id;
    const inviterId = inviterData._id;

    const alreadyAFriend = await UserModel.findOne(
      {
        _id: userId,
        "friends._id": inviterId,
      },
      null,
      { session }
    );
    if (alreadyAFriend) {
      return res.status(400).json("This is already your friend.");
    }

    const [room] = await RoomModel.create(
      [{ participants: [userId, inviterId] }],
      { session }
    );
    const roomId = room._id;

    const userDoc = await UserModel.findByIdAndUpdate(
      userId,
      {
        $pull: { invitations: { _id: inviterId } },
        $push: { friends: { roomId, ...inviterData } },
      },
      { session, new: true, select: "-_id invitations friends" }
    );

    await UserModel.findOneAndUpdate(
      {
        _id: inviterId,
        "myInvitations._id": userId,
      },
      {
        $set: {
          "myInvitations.$.status": "accepted",
        },
        $push: { friends: { roomId, ...userData } },
      },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.json({ data: userDoc, accessToken });
  } catch (err) {
    await session.abortTransaction();
    console.log(err);
    res.json(err.message);
  }
};
