const UserModel = require("../../models/UserModel");
const mongoose = require("mongoose");

module.exports = async function rejectInvit({ inviteeId, inviterId }) {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      if (!inviteeId || !inviterId) throw new Error("insufficient resources");

      const pullInvitation = (userId, invitType, invitId) =>
        UserModel.findByIdAndUpdate(
          userId,
          {
            $pull: { [`invitations.${invitType}`]: { _id: invitId } },
          },
          { session }
        );

      await Promise.all([
        pullInvitation(inviterId, "sended", inviteeId),
        pullInvitation(inviteeId, "received", inviterId),
      ]);
    });
  } catch (err) {
    console.log(err);

    throw new Error(err);
  } finally {
    await session.endSession();
  }
};
