const UserModel = require("../../models/UserModel");

module.exports = async function getInvitations({ body, accessToken }, res) {
  const { userId } = body;
  if (!userId) return res.sendStatus(400);

  try {
    const invitations = await UserModel.findById(
      userId,
      "-_id myInvitations invitations"
    );

    res.json({ ...invitations, accessToken });
  } catch (err) {
    console.log(err);
    res.json(err.message);
  }
};
