const mongoose = require("mongoose");
const UserModel = require("../../models/UserModel");
const bcrypt = require("bcryptjs");

module.exports = async function identification(req, res) {
  const { loginData } = req.body;
  if (!loginData) return res.status(400).json("insufficient resources");

  // res.json(loginData);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userDoc = await UserModel.findOne(
      { "login.email": loginData.email },
      "-_id login",
      { session }
    );

    if (!userDoc) return res.status(404).json("user not found");

    const passMatch = await bcrypt.compare(
      loginData.password,
      userDoc.login.password
    );
    if (!passMatch) return res.status(404).json("wrong password");

    res.json({ accessToken: req.accessToken });
  } catch (err) {
    console.log(err);
  }
};
