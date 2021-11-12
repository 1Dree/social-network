const UserModel = require("../../models/UserModel");
const mongoose = require("mongoose");

module.exports = async function rejectInvitation(req, res) {
  const { userId, inviterId } = req.body;
  if (!userId || !inviterId) return res.sendStatus(400);

  // res.json(req.body);
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userDoc = await UserModel.findByIdAndUpdate(
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

    res.json(userDoc);
  } catch (err) {
    session.abortTransaction();
    console.log(err);
    res.json(err.message);
  }
};
