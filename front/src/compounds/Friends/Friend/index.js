import { useRef } from "react";

import "./friend.css";
import "../../../styles/discardanimation.css";
import { Profile, IconWrapper } from "../../../components";
import { useSocket } from "../../../contexts/SocketContext";
import { useUser } from "../../../contexts/UserContext";
import { useAside } from "../../../contexts/AsideContext";
import { useHome } from "../../../contexts/HomeContext";
import {
  onDiscardAnimation,
  msgsMomentFormatter,
  msgjwtDecoder,
} from "../../../lib";
import API from "../../../API";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import CollectionsIcon from "@mui/icons-material/Collections";
import VideoCameraBackIcon from "@mui/icons-material/VideoCameraBack";

export default function Friend(friend) {
  const { socket } = useSocket();
  const { removeFriend, user, socketAuth } = useUser();
  const { chosenFriend, chosenFriendInitialState, chosenFriendSetter } =
    useHome();
  const { chatRoom, setChatRoom } = useAside();

  const thisFriendRef = useRef();

  const wasChosen = chosenFriend._id === friend._id;
  const { ltMsg } = friend;

  const LtMsgMatrix = ({ content, type, moment }) => {
    const iconSize = { fontSize: "15px" };
    const ltMsgJSXTypes = {
      image: <CollectionsIcon style={iconSize} />,
      video: <VideoCameraBackIcon style={iconSize} />,
      text: content && msgjwtDecoder(content),
    };
    const formattedMoment = msgsMomentFormatter(moment).result[1];

    return (
      <div className="friend-lt-msg-container">
        <p className="friend-lt-msg">
          {ltMsgJSXTypes[type]} {type !== "text" && type}
        </p>

        <p>{formattedMoment}</p>
      </div>
    );
  };

  const hideOptionsSwitch = e => {
    e.stopPropagation();
    thisFriendRef.current.classList.toggle("options");
  };

  const onFriendChoosing = () => {
    if (wasChosen) return;
    if (chatRoom)
      socket.emit("leave_room", {
        header: {
          room: chatRoom,
          roomAction: "leave",
        },
      });

    socket.emit("join_room", {
      header: {
        room: friend.chatRoom,
        roomAction: "join",
      },
    });

    setChatRoom(friend.chatRoom);
    chosenFriendSetter({
      _id: friend._id,
      name: friend.name,
      profile: friend.profile.objectURL,
      chatRoom: friend.chatRoom,
      mailbox: friend.mailbox,
    });
  };

  const onFriendRemoval = onDiscardAnimation(async () => {
    try {
      socket.emit("send_data", {
        header: {
          senderRoom: user.mailbox,
          receiverRoom: friend.mailbox,
          receiverRoomEvent: "remove_friend",
          auth: socketAuth,
        },
        payload: {
          receiverRoomData: {
            friendId: user._id,
          },
        },
      });

      removeFriend(friend._id);

      if (chosenFriend._id === friend._id) {
        chosenFriendSetter(chosenFriendInitialState);
      }

      await API.chat.undoFriendship(user, {
        userId: user._id,
        friendId: friend._id,
        roomId: friend.chatRoom,
      });
    } catch (err) {
      console.log(err);
    }
  });

  return (
    <div
      ref={thisFriendRef}
      className={`friend ${wasChosen ? "chosen" : ""}`}
      onClick={onFriendChoosing}
    >
      <div className="friend-content">
        <div className="friend-profile">
          <Profile src={friend.profile.objectURL} />
        </div>

        <div className="friend-info">
          <p className="friend-name">{friend.name}</p>

          {ltMsg && (
            <LtMsgMatrix
              content={ltMsg.content}
              type={ltMsg.type}
              moment={ltMsg.updatedAt}
            />
          )}
        </div>

        <IconWrapper
          Icon={MoreVertIcon}
          className="friend-options"
          onClick={hideOptionsSwitch}
        />
      </div>

      <div className="friend-options-modal">
        <button onClick={e => onFriendRemoval(e, thisFriendRef.current)}>
          undo friendship
        </button>
      </div>
    </div>
  );
}
