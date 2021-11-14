const UserModel = require("../../models/UserModel");
const mongoose = require("mongoose");

module.exports = async function rejectInvitation({ body, accessToken }, res) {
  const { userId, inviterId } = body;
  if (!userId || !inviterId) return res.sendStatus(400);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { invitations } = await UserModel.findByIdAndUpdate(
      userId,
      {
        $pull: { invitations: { _id: inviterId } },
      },
      { session, new: true, select: "-_id invitations" }
    );

    await UserModel.findOneAndUpdate(
      {
        _id: inviterId,
        "myInvitations._id": userId,
      },
      {
        $set: {
          "myInvitations.$.status": "Seu convite foi rejeitado",
        },
      },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.json({ invitations, accessToken });
  } catch (err) {
    session.abortTransaction();
    console.log(err);
    res.json(err.message);
  }
};
