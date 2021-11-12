const RoomModel = require("../../models/RoomModel");
const mongoose = require("mongoose");

module.exports = async function retrieveMsgs(req, res) {
  const { userId, roomId } = req.body;
  if (!userId || !roomId) return res.sendStatus(400);

  try {
    let { messages } = await RoomModel.findById(roomId, "-_id messages");

    messages = messages.filter(
      message =>
        !message.hideFrom.length ||
        message.hideFrom.some(id => id.toString() !== userId)
    );

    res.json({ messages });
  } catch (err) {
    console.log(err);
    res.json(err.message);
  }
};
