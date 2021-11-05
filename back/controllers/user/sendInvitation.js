const {
  MyInvitationModel,
  InvitationModel,
} = require("../../models/InvitationModel");
const mongoose = require("mongoose");

module.exports = async function sendInvitation(req, res) {
  const { userData, invitedUserData } = req.body;
  if (!userData || !invitedUserData) return res.sendStatus(400);

  //   res.json(req.body);
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [myInvitations] = await MyInvitationModel.create([invitedUserData], {
      session,
      new: true,
    });

    await InvitationModel.create([userData], { session });

    await session.commitTransaction();
    session.endSession();

    res.json({ data: myInvitations });
  } catch (err) {
    session.abortTransaction();
    console.log(err);
    res.json(err.message);
  }
};
