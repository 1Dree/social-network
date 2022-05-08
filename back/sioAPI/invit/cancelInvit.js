const mongoose = require("mongoose");
const UserModel = require("../../models/UserModel");

module.exports = async function cancelInvit({ inviterId, inviteeId }) {
  if (!inviterId || !inviteeId) throw new Error("insufficient resouces");
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await UserModel.findByIdAndUpdate(
      inviterId,
      {
        $pull: { "invitations.sended": { _id: inviteeId } },
      },
      { session }
    );

    await UserModel.findByIdAndUpdate(
      inviteeId,
      {
        $pull: { "invitations.received": { _id: inviterId } },
      },
      { session }
    );

    await session.commitTransaction();
    session.endSession();
  } catch (err) {
    await session.abortTransaction();
    throw new Error(err.message);
  }
};
