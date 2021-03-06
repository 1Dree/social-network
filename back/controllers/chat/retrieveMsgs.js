const RoomModel = require("../../models/RoomModel");

module.exports = async function retrieveMsgs({ query, accessToken }, res) {
  const { userId, roomId } = query;
  if (!userId || !roomId) return res.sendStatus(400);

  try {
    let { messages } = await RoomModel.findById(roomId, "-_id messages");

    messages = messages.filter(
      message =>
        !message.hideFrom.length ||
        message.hideFrom.some(id => id.toString() !== userId)
    );

    res.json({ messages, accessToken });
  } catch (err) {
    console.log(err);
    res.json(err.message);
  }
};
