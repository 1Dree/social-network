const UserModel = require("../../models/UserModel");

module.exports = async function rejectInvitation(req, res) {
  const { userId, invitedId } = req.body;

  try {
    const userDoc = await UserModel.findByIdAndUpdate(
      userId,
      {
        $pull: { myInvitations: { _id: invitedId } },
      },
      { new: true, select: "-_id myInvitations" }
    );

    res.json(userDoc);
  } catch (err) {
    console.log(err);
    res.json(err.message);
  }
};
