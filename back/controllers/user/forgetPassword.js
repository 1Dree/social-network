const UserModel = require("../../models/UserModel");
const bcrypt = require("bcryptjs");

module.exports = async function forgetPassword({ body }, res) {
  const { userEmail, newPassword } = body;
  if (!userEmail || !newPassword) return res.sendStatus(400);

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    await UserModel.findOneAndUpdate(
      { email: userEmail },
      {
        $set: { password: hash },
      }
    );

    res.sendStatus(200);
  } catch (err) {
    session.abortTransaction();

    console.log(err);
    res.sendStatus(400);
  }
};
