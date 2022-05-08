import "./message.css";
import { useState, useRef } from "react";
import { useUser } from "../../../../../contexts/UserContext";
import { useHome } from "../../../../../contexts/HomeContext";
import { useChat } from "../../../../../contexts/ChatContext";
import onFileMsg from "./FileMsg";
import { IconWrapper } from "../../../../../components";
import useLoading from "../../../../../lib/useLoading";

import useFetchFile from "./useFetchFile";
import useDeleteMsg from "./useDeleteMsg";

import MoreVertIcon from "@mui/icons-material/MoreVert";

export default function ChatMessage(message) {
  const { user } = useUser();
  const { removeClassOnExternalClick } = useHome();
  const { setOverlayImg, showOverlayImgSwitch } = useChat();

  const [fileObjectURL, setFileObjectURL] = useState("");
  const { loading, loadingStateSwitch, LoadingComponent } = useLoading();

  const onDeleteMsg = useDeleteMsg(message);

  const thisMsgRef = useRef();
  const chatMsgOpts = useRef();

  let { type, content } = message;
  const propTitle = message.author === user._id ? "my-msg" : "";
  const hour = message.createdAt[1];
  const fileMsg = onFileMsg({
    loading,
    LoadingComponent,
    fetchFile: useFetchFile({
      content,
      type,
      loadingStateSwitch,
      setFileObjectURL,
    }),
    type,
    fileObjectURL,
  });

  const onImgClick = () => {
    setOverlayImg(fileObjectURL);
    showOverlayImgSwitch();
  };

  const msgOptsToggler = () => chatMsgOpts.current.classList.toggle("active");

  const jsxMsgTypes = {
    text: <p className="content">{content}</p>,
    image: fileMsg(
      <img src={fileObjectURL} onClick={onImgClick} alt="message" />
    ),
    video: fileMsg(<video src={fileObjectURL} controls />),
  };

  return (
    <div className={`chat-msg-container ${propTitle}`}>
      <div className={`chat-message ${type} ${propTitle}`} ref={thisMsgRef}>
        {jsxMsgTypes[type]}

        <div className="chat-message-assets">
          <div>
            {message.subtitle && <p>{message.subtitle}</p>}
            <p className="moment">{hour}</p>
          </div>

          {propTitle && (
            <>
              <IconWrapper
                Icon={MoreVertIcon}
                iconStyle={{ fontSize: "20px", color: "gray" }}
                className="chat-message-menu"
                onClick={() => {
                  msgOptsToggler();
                  removeClassOnExternalClick(chatMsgOpts.current, "active");
                }}
              />

              <div
                className="chat-message-opts"
                ref={chatMsgOpts}
                onClick={msgOptsToggler}
              >
                <p className="chat-message-opt" onClick={onDeleteMsg}>
                  Delete totaly
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
