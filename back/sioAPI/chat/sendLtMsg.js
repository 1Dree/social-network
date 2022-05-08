const UserModel = require("../../models/UserModel");

module.exports = async function sendLtMsg({ userId, friendId, ltMsg }) {
  if (!userId || !friendId || !ltMsg) throw new Error("insufficient resouces");

  try {
    await UserModel.findOneAndUpdate(
      { _id: friendId, "friends._id": ltMsg.author },
      {
        $set: {
          "friends.$.ltMsg": { ...ltMsg },
        },
      }
    );
  } catch (err) {
    throw new Error(err.message);
  }
};
