const UserModel = require("../../models/UserModel");
const mongoose = require("mongoose");

module.exports = async function sendInvitation(req, res) {
  const { userData, invitedUserData } = req.body;
  if (!userData || !invitedUserData) return res.sendStatus(400);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const invitation = await UserModel.findOne(
      { _id: userData._id, "myInvitations._id": invitedUserData._id },
      "-_id myInvitations._id"
    );

    if (invitation) return res.status(400).json("invitation already made");

    const userDoc = await UserModel.findByIdAndUpdate(
      userData._id,
      {
        $push: { myInvitations: invitedUserData },
      },
      {
        session,
        new: true,
        select: "-_id myInvitations",
      }
    );

    await UserModel.findByIdAndUpdate(
      invitedUserData._id,
      {
        $push: { invitations: userData },
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
