const RoomModel = require("../../models/RoomModel");

module.exports = async function sendInvitation({ body, accessToken }, res) {
  const { roomId, message } = body;
  if (!roomId || !message) return res.sendStatus(400);

  try {
    const { messages } = await RoomModel.findByIdAndUpdate(
      roomId,
      {
        $push: { messages: message },
      },
      { select: "-_id messages", new: true }
    );

    res.json({ messages, accessToken });
  } catch (err) {
    console.log(err);

    res.json(err.message);
  }
};
