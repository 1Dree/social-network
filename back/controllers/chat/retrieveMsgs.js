const RoomModel = require("../../models/RoomModel");

module.exports = async function sendInvitation(req, res) {
  const { roomId } = req.body;
  if (!roomId) return res.sendStatus(400);

  try {
    const roomMessages = await RoomModel.findById(roomId, "-_id messages");

    res.json(roomMessages);
  } catch (err) {
    console.log(err);

    res.json(err.message);
  }
};
