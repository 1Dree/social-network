const UserModel = require("../../models/UserModel");

module.exports = async function getInvitations(req, res) {
  const { userId } = req.body;
  if (!userId) return res.sendStatus(400);

  try {
    const invitations = await UserModel.findById(
      userId,
      "-_id myInvitations invitations"
    );

    res.json(invitations);
  } catch (err) {
    console.log(err);
    res.json(err.message);
  }
};
