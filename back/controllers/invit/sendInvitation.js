const UserModel = require("../../models/UserModel");
const mongoose = require("mongoose");

module.exports = async function sendInvitation({ body, accessToken }, res) {
  const { userData, invitedUserData } = body;
  if (!userData || !invitedUserData) return res.sendStatus(400);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const invitation = await UserModel.findOne(
      { _id: userData._id, "myInvitations._id": invitedUserData._id },
      "-_id myInvitations._id"
    );

    if (invitation) return res.status(400).json("invitation already made");

    const { myInvitations } = await UserModel.findByIdAndUpdate(
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

    res.json({ myInvitations, accessToken });
  } catch (err) {
    await session.abortTransaction();
    console.log(err);
    res.json(err.message);
  }
};
