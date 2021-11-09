const RoomModel = require("../../models/RoomModel");

module.exports = async function sendInvitation(req, res) {
  const { userId, roomId } = req.body;
  if (!userId || !roomId) return res.sendStatus(400);

  try {
    let roomMessages = await RoomModel.findById(roomId, "-id messages");
    roomMessages = roomMessages.filter();

    res.json(roomMessages);
  } catch (err) {
    console.log(err);

    res.json(err.message);
  }
};
