import "./chat.css";
import {
  ChatHeader,
  ChatContent,
  ChatMsgBox,
  ChatFileUploader,
} from "./Public";
import { useChat } from "../../contexts/ChatContext";

import Picker from "emoji-picker-react";

export default function Chat() {
  const { showEmojiPicker, setChatInputValue } = useChat();

  const onEmojiClick = (event, emojiObject) => {
    setChatInputValue(prevState => prevState + emojiObject.emoji);
  };

  return (
    <div id="chat" className={showEmojiPicker ? "picker" : ""}>
      <ChatFileUploader />

      <ChatHeader />
      <ChatContent />
      <ChatMsgBox />
      <Picker onEmojiClick={onEmojiClick} />
    </div>
  );
}
