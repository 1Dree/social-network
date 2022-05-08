import "./chatmsgbox.css";
import { IconWrapper } from "../../../../components";
import { useSocket } from "../../../../contexts/SocketContext";
import { useUser } from "../../../../contexts/UserContext";
import { useHome } from "../../../../contexts/HomeContext";
import { useChat } from "../../../../contexts/ChatContext";

import SendIcon from "@mui/icons-material/Send";
import ImageIcon from "@mui/icons-material/Image";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import VideoCameraBackIcon from "@mui/icons-material/VideoCameraBack";
import crypto from "crypto";
import jwt from "jsonwebtoken";

export default function ChatMsgBox() {
  const { socket } = useSocket();
  const { user, setUser, socketAuth } = useUser();
  const { chosenFriend } = useHome();
  const {
    chatInputValue,
    setChatInputValue,
    showEmojiPickerSwitch,
    fileUploaderDisplaySwitch,
    setFileUploaderType,
  } = useChat();

  const sendMessage = async () => {
    if (!chatInputValue) return;
    setChatInputValue("");

    const friendIndex = user.friends.findIndex(
      friend => friend._id === chosenFriend._id
    );

    if (friendIndex) {
      // put friend in first position.
      setUser(prevState => {
        const { friends } = prevState;
        const friend = friends[friendIndex];

        friends.splice(friendIndex, 1);
        friends.splice(0, 0, friend);

        return { ...prevState, friends };
      });
    }

    const author = user._id;
    const encMsg = jwt.sign(
      chatInputValue,
      process.env.REACT_APP_MESSAGES_TOKEN_SECRET
    );
    const message = {
      _id: crypto.randomBytes(12).toString("hex"),
      type: "text",
      content: encMsg,
      author,
    };
    const ltMsg = {
      author,
      msgId: message._id,
      type: "text",
      content: message.type === "text" ? encMsg : message.type,
    };

    socket.emit("send_data", {
      header: {
        senderRoom: user.mailbox,
        receiverRoom: chosenFriend.chatRoom,
        secondaryReceiverRoom: chosenFriend.mailbox,
        receiverRoomEvent: "receive_message",
        auth: socketAuth,
      },
      payload: {
        toDB: {
          action: "sendMessage",
          data: {
            room: chosenFriend.chatRoom,
            friendId: chosenFriend._id,
            message,
            ltMsg,
          },
        },
      },
    });
  };

  return (
    <div id="chat-msg-box">
      <input
        id="chat-msg-box-input"
        type="text"
        placeholder="message"
        onChange={e => setChatInputValue(e.target.value)}
        value={chatInputValue}
      />

      <IconWrapper
        Icon={EmojiEmotionsIcon}
        onClick={showEmojiPickerSwitch}
        className="open-emoji-picker"
      />

      <IconWrapper
        Icon={ImageIcon}
        className="upload-img"
        onClick={() => {
          setFileUploaderType("image");
          fileUploaderDisplaySwitch();
        }}
      />

      <IconWrapper
        Icon={VideoCameraBackIcon}
        className="upload-video"
        onClick={() => {
          setFileUploaderType("video");
          fileUploaderDisplaySwitch();
        }}
      />

      <IconWrapper Icon={SendIcon} className="send-msg" onClick={sendMessage} />
    </div>
  );
}
