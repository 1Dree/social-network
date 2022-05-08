const UserModel = require("../../models/UserModel");

module.exports = async function getInvitations({ params, accessToken }, res) {
  const { userId } = params;
  if (!userId) return res.sendStatus(400);

  try {
    const { invitations } = await UserModel.findById(
      userId,
      "-_id invitations"
    );

    res.json({ invitations, accessToken });
  } catch (err) {
    console.log(err);
    res.json(err.message);
  }
};
