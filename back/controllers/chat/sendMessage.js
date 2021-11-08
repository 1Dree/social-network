const RoomModel = require("../../models/RoomModel");

module.exports = async function sendInvitation(req, res) {
  const { roomId, message } = req.body;
  if (!roomId || !message) return res.sendStatus(400);

  try {
    const roomMessages = await RoomModel.findByIdAndUpdate(
      roomId,
      {
        $push: { messages: message },
      },
      { select: "-_id messages", new: true }
    );

    res.json(roomMessages);
  } catch (err) {
    console.log(err);

    res.json(err.message);
  }
};
