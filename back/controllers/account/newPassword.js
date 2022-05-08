const UserModel = require("../../models/UserModel");
const bcrypt = require("bcryptjs");

module.exports = async function newPassword({ body }, res) {
  const { email, newPassword } = body;
  if (!email || !newPassword) return res.sendStatus(400);

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    await UserModel.findOneAndUpdate(
      { "login.email": email },
      {
        $set: { "login.password": hash },
      }
    );

    res.sendStatus(200);
  } catch (err) {
    await session.abortTransaction();

    console.log(err);
    res.status(400).json(err.message);
  }
};
