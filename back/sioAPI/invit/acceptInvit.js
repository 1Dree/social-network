const UserModel = require("../../models/UserModel");
const RoomModel = require("../../models/RoomModel");
const mongoose = require("mongoose");

module.exports = async function acceptInvit({ invitee, inviter }) {
  const session = await mongoose.startSession();

  try {
    let resultValue = {};

    const transaction = async () => {
      if (!invitee || !inviter) throw new Error("insufficient resources");

      const [inviteeId, inviterId] = [invitee._id, inviter._id];

      const alreadyAFriend = await UserModel.findOne(
        {
          _id: inviteeId,
          "friends._id": inviterId,
        },
        null,
        { session }
      );
      if (alreadyAFriend) {
        throw new Error("This is already your friend.");
      }

      const [room] = await RoomModel.create(
        [{ participants: [inviteeId, inviterId] }],
        { session }
      );

      const chatRoom = room._id;

      const addFriend = (
        userId,
        invitType,
        invitId,
        friendData,
        complementaryOptions
      ) =>
        UserModel.findByIdAndUpdate(
          userId,
          {
            $pull: { [`invitations.${invitType}`]: { _id: invitId } },
            $push: { friends: { chatRoom, ...friendData } },
          },
          { session, ...complementaryOptions }
        );

      const { friends } = await addFriend(
        inviteeId,
        "received",
        inviterId,
        inviter,
        {
          new: true,
          select: "-_id friends",
        }
      );

      await addFriend(inviterId, "sended", inviteeId, invitee, {});

      resultValue = {
        friends: friends.map(friend => {
          if (friend._id.toString() === inviterId) {
            friend.chatRoom = chatRoom;
          }

          return friend;
        }),
      };
    };

    await session.withTransaction(transaction);

    return resultValue;
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    await session.endSession();
  }
};
