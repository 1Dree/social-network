const sendInvit = require("./invit/sendInvit");
const cancelInvit = require("./invit/cancelInvit");
const rejectInvit = require("./invit/rejectInvit");
const acceptInvit = require("./invit/acceptInvit");
const sendMessage = require("./chat/sendMessage");
const sendLtMsg = require("./chat/sendLtMsg");

require("dotenv").config();

const dbActions = {
  sendInvit,
  cancelInvit,
  rejectInvit,
  acceptInvit,
  sendMessage,
  sendLtMsg,
};

const roomLeader =
  ({ socket }) =>
  ({ header }) => {
    socket[header.roomAction](header.room);
  };

const messenger = io => (room, event, data) => {
  io.to(room).emit(event, data);
};

const sioGeneralAuthDBInteractionsExecutor =
  deps =>
  async ({ header, payload }, accessToken) => {
    const { senderRoom } = header;
    const Msgr = messenger(deps.io);

    try {
      let result = {};

      if (payload.toDB) {
        const { action, data } = payload.toDB;

        result = await dbActions[action](data);

        if (action === "sendMessage") {
          payload.receiverRoomData = { message: result.thisMsg };

          Msgr(header.secondaryReceiverRoom, "receive_lt_msg", {
            ltMsg: result.ltMsg,
          });
        }
      }

      Msgr(
        header.receiverRoom,
        header.receiverRoomEvent,
        payload.receiverRoomData
      );

      if (header.receiverRoomEvent === "delete_msg") {
        Msgr(
          header.secondaryReceiverRoom,
          "delete_ltMsg",
          payload.receiverRoomData
        );
      }

      Msgr(senderRoom, "reply", {
        friends: result ? result.friends : null,
        accessToken,
      });
    } catch (err) {
      console.log(err);
      Msgr(senderRoom, "error", err.message);
    }
  };

const onBroadcastingData =
  deps =>
  ({ header, payload }, accessToken) => {
    deps.socket.broadcast.emit(header.receiverRoomEvent, payload.receiverData);

    if (header.receiverRoomEvent === "delete_contact") return;

    messenger(deps.io)(header.senderRoom, "reply", {
      accessToken,
    });
  };

const handlers = {
  roomLeader,
  sioGeneralAuthDBInteractionsExecutor,
  onBroadcastingData,
};

const onProvide = handlers => deps =>
  Object.entries(handlers).reduce((acc, [key, handler]) => {
    acc[key] = handler(deps);

    return acc;
  }, {});

const sioAPI = {
  provide: onProvide(handlers),
  roomLeader,
};

module.exports = sioAPI;
