import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { useUser } from "./UserContext";
import { useHome } from "./HomeContext";
import { useSocket } from "./SocketContext";

import {
  stateSwitch,
  msgsMomentFormatter,
  msgjwtDecoder,
  duplicateVerifier,
} from "../lib";
import WrappedLoading from "../components/WrappedLoading";
import API from "../API";
import useLoading from "../lib/useLoading";

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

const messagesInitialState = {
  today: [],
  yesterday: [],
  dated: [],
};

export default function ChatContextProvider({ children }) {
  const { user, setUser } = useUser();
  const { choosenFriend } = useHome();
  const { socket } = useSocket();

  const { loading, loadingStateSwitch, LoadingComponent } = useLoading();
  const [messages, setMessages] = useState(messagesInitialState);
  const [objectURLs, setObjectURLs] = useState([]);
  const [fileUploaderDisplay, setFileUploaderDisplay] = useState(false);
  const [fileUploaderType, setFileUploaderType] = useState("");
  const [chatInputValue, setChatInputValue] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showOverlayImg, setShowOverlayImg] = useState(false);
  const [overlayImg, setOverlayImg] = useState("");
  const [chatContentLoading, setChatContentLoading] = useState();

  const [
    showEmojiPickerSwitch,
    fileUploaderDisplaySwitch,
    showOverlayImgSwitch,
  ] = [
    stateSwitch(setShowEmojiPicker),
    stateSwitch(setFileUploaderDisplay),
    stateSwitch(setShowOverlayImg),
  ];

  const removeMsg = msgId =>
    setMessages(prevState =>
      Object.entries(prevState).reduce(
        (acc, [key, value]) => {
          acc[key] = value.filter(({ _id }) => _id !== msgId);

          return acc;
        },
        {
          today: [],
          yesterday: [],
          dated: [],
        }
      )
    );

  const rehidePickerOnExternalClick = useCallback(() => {
    const chat = document.querySelector("#chat");
    const picker = document.querySelector("#chat .emoji-picker-react");

    const outPicker = e => {
      if (chat.contains(e.target) && !picker.contains(e.target)) {
        chat.classList.remove("picker");
        showEmojiPickerSwitch();
        window.removeEventListener("click", outPicker);
      }
    };

    window.addEventListener("click", outPicker);
  }, [showEmojiPickerSwitch]);

  const value = {
    loading,
    messages,
    removeMsg,
    setObjectURLs,
    chatInputValue,
    setChatInputValue,
    showEmojiPicker,
    setShowEmojiPicker,
    showEmojiPickerSwitch,
    fileUploaderDisplay,
    fileUploaderDisplaySwitch,
    fileUploaderType,
    setFileUploaderType,
    overlayImg,
    setOverlayImg,
    showOverlayImg,
    setShowOverlayImg,
    showOverlayImgSwitch,
    chatContentLoading,
  };

  useEffect(() => {
    setChatInputValue("");
    setShowEmojiPicker(false);

    const getMessages = async () => {
      loadingStateSwitch();

      try {
        await API.getters.onGetMessages(
          user,
          setUser,
          setMessages,
          choosenFriend.chatRoom
        );
      } catch (err) {
        console.log(err);
      } finally {
        loadingStateSwitch();
      }
    };

    const revokeObjectURLs = () => {
      objectURLs.forEach(URL.revokeObjectURL);
      setObjectURLs([]);
    };

    getMessages();

    if (objectURLs.length) revokeObjectURLs();
  }, [choosenFriend]);

  useEffect(() => {}, [choosenFriend]);

  useEffect(() => {
    let mount = true;

    if (!mount) return;

    socket.on("receive_message", ({ message }) => {
      setMessages(prevMsgs =>
        duplicateVerifier(prevMsgs.today, message._id)
          ? prevMsgs
          : {
              ...prevMsgs,
              today: [
                ...prevMsgs.today,
                {
                  ...message,
                  createdAt: msgsMomentFormatter(message.createdAt).result,
                  content:
                    message.type === "text"
                      ? msgjwtDecoder(message.content)
                      : message.content,
                },
              ],
            }
      );
    });

    socket.on("delete_msg", ({ msgId }) => {
      setChatContentLoading(true);

      (async () => removeMsg(msgId))().then(() => setChatContentLoading(false));
    });

    socket.on("delete_ltMsg", ({ msgId }) => {
      setUser(prevState => ({
        ...prevState,
        friends: prevState.friends.map(friend => {
          if (friend.ltMsg && friend.ltMsg.msgId === msgId) {
            friend.ltMsg = undefined;
          }

          return friend;
        }),
      }));
    });

    return () => (mount = false);
  }, [socket, setUser]);

  useEffect(() => {
    if (showEmojiPicker) rehidePickerOnExternalClick();
  }, [showEmojiPicker, rehidePickerOnExternalClick]);

  return (
    <ChatContext.Provider value={value}>
      {loading ? <LoadingComponent /> : children}
    </ChatContext.Provider>
  );
}
