const UserModel = require("../../models/UserModel");

module.exports = async function retrieveAll(req, res) {
  try {
    const users = await UserModel.find({});

    res.json({ users });
  } catch (err) {
    console.log(err);
    res.json(err.message);
  }
};
