const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reqString = {
  type: String,
  required: true,
};

const messageSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    type: reqString,
    content: reqString,
    author: Schema.Types.ObjectId,
    subtitle: String,
    hideFrom: [Schema.Types.ObjectId],
  },
  { timestamps: true }
);

const roomSchema = new Schema({
  participants: [Schema.Types.ObjectId],
  messages: [messageSchema],
});

const RoomModel = mongoose.model("room", roomSchema);

module.exports = RoomModel;
