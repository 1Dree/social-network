const UserModel = require("../../models/UserModel");

module.exports = async function rejectInvitation({ body, accessToken }, res) {
  const { userId, invitedId } = body;
  if (!userId || !invitedId) return res.sendStatus(400);

  try {
    const { myInvitations } = await UserModel.findByIdAndUpdate(
      userId,
      {
        $pull: { myInvitations: { _id: invitedId } },
      },
      { new: true, select: "-_id myInvitations" }
    );

    res.json({ myInvitations, accessToken });
  } catch (err) {
    console.log(err);
    res.json(err.message);
  }
};
