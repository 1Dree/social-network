const UserModel = require("../../models/UserModel");

module.exports = async function retrieveAll({ accessToken }, res) {
  try {
    const users = await UserModel.find({});

    res.json({ users, accessToken });
  } catch (err) {
    console.log(err);
    res.json(err.message);
  }
};
