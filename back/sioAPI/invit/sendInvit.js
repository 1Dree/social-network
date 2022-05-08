const UserModel = require("../../models/UserModel");
const mongoose = require("mongoose");

module.exports = async function sendInvit({ inviter, invitee }) {
  if (!inviter || !invitee) return { err: "insufficient resources" };

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const invitation = await UserModel.findOne(
        {
          _id: inviter._id,
          $or: [
            { "invitations.sended._id": invitee._id },
            { "invitations.received._id": invitee._id },
          ],
        },
        "-_id invitations.sended._id"
      );

      if (invitation) throw new Error("invitation already made.");

      const pushInvit = (userId, invitType, subject) =>
        UserModel.findByIdAndUpdate(
          userId,
          {
            $push: { [`invitations.${invitType}`]: subject },
          },
          {
            session,
          }
        );

      await pushInvit(inviter._id, "sended", invitee);
      await pushInvit(invitee._id, "received", inviter);
    });
  } catch (err) {
    throw err;
  } finally {
    await session.endSession();
  }
};
