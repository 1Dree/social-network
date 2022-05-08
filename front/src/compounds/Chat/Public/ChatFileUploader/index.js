import { useState, useEffect } from "react";

import "./chatfileuploader.css";
import { IconWrapper, WrappedLoading } from "../../../../components";
import { useSocket } from "../../../../contexts/SocketContext";
import { useErr } from "../../../../contexts/ErrContext";
import { useUser } from "../../../../contexts/UserContext";
import { useHome } from "../../../../contexts/HomeContext";
import { useChat } from "../../../../contexts/ChatContext";
import { Overlay } from "../../../../components";
import API from "../../../../API";

import SendIcon from "@mui/icons-material/Send";
import CollectionsIcon from "@mui/icons-material/Collections";
import VideoCameraBackIcon from "@mui/icons-material/VideoCameraBack";

export default function ChatFileUploader() {
  const { setErr } = useErr();
  const { socket } = useSocket();
  const { user, setUser, socketAuth } = useUser();
  const { chosenFriend } = useHome();
  const { fileUploaderDisplay, fileUploaderDisplaySwitch, fileUploaderType } =
    useChat();

  const [choosenFile, setChoosenFile] = useState(null);
  const [choosenFileBlobURL, setChoosenFileBlobURL] = useState("");
  const [fileSubtitle, setFileSubtitle] = useState("");
  const [fileUploaderLoading, setFileUploaderLoading] = useState();

  const chosenFileJSXTypes = {
    image: (
      <img
        src={choosenFileBlobURL}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
        alt="chosen file"
      />
    ),
    video: (
      <video controls>
        <source src={choosenFileBlobURL} type="video/webm" />
      </video>
    ),
  };

  const onFileSelection = e => {
    const file = e.target.files[0];

    if (!file.type.includes(fileUploaderType)) {
      alert(`invalid file type: it must be a ${fileUploaderType}.`);
      return;
    }

    const objectURL = URL.createObjectURL(file);

    setChoosenFile(file);
    setChoosenFileBlobURL(objectURL);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const chatFileUploader = document.querySelector("#chat-file-uploader");
    const formData = new FormData();

    chatFileUploader.classList.add("submiting");
    formData.append("file", choosenFile);
    setFileSubtitle("");

    setFileUploaderLoading(true);

    try {
      const message = await API.toFiles.onUploadFile(
        setUser,
        formData,
        fileSubtitle,
        user,
        fileUploaderType,
        chosenFriend.chatRoom
      );
      const ltMsg = {
        type: fileUploaderType,
        author: user._id,
        updatedAt: message.createdAt,
      };

      if (fileSubtitle) message.subtitle = fileSubtitle;

      socket.emit("send_data", {
        header: {
          senderRoom: user.mailbox,
          receiverRoom: chosenFriend.mailbox,
          receiverRoomEvent: "receive_lt_msg",
          auth: socketAuth,
        },
        payload: {
          toDB: {
            action: "sendLtMsg",
            data: {
              userId: user._id,
              friendId: chosenFriend._id,
              ltMsg,
            },
          },
          receiverRoomData: {
            ltMsg,
          },
        },
      });
      socket.emit("send_data", {
        header: {
          senderRoom: user.mailbox,
          receiverRoom: chosenFriend.chatRoom,
          receiverRoomEvent: "receive_message",
          auth: socketAuth,
        },
        payload: {
          receiverRoomData: {
            message,
          },
        },
      });
    } catch (err) {
      console.log(err);
      setErr(err.message);
      alert("Some error has occured, try again later");
    } finally {
      fileUploaderDisplaySwitch();
      URL.revokeObjectURL(choosenFileBlobURL);
      setChoosenFileBlobURL("");
      setFileSubtitle("");
      setFileUploaderLoading(false);
    }
  }

  useEffect(() => {
    if (fileUploaderDisplay) {
      setChoosenFile(null);
      setChoosenFileBlobURL("");
      setFileSubtitle("");
    }
  }, [fileUploaderDisplay]);

  return (
    <Overlay
      display={fileUploaderDisplay}
      displaySwitch={fileUploaderDisplaySwitch}
      id="chat-file-uploader"
      contentId="chat-file-uploader-content"
    >
      <form onSubmit={handleSubmit}>
        <h1>
          Upload{" "}
          {fileUploaderType.charAt(0).toUpperCase() + fileUploaderType.slice(1)}
        </h1>

        <div id="chat-file-uploader-file">
          {choosenFileBlobURL ? (
            chosenFileJSXTypes[fileUploaderType]
          ) : (
            <label htmlFor="file">
              <IconWrapper
                Icon={
                  fileUploaderType === "image"
                    ? CollectionsIcon
                    : VideoCameraBackIcon
                }
                className="choose-file"
              />
              <input
                type="file"
                id="file"
                name="file"
                accept={fileUploaderType + "/*"}
                onChange={onFileSelection}
                required
              />
            </label>
          )}
        </div>

        <div id="chat-file-uploader-input-btn">
          <input
            id="add-subtitle"
            type="text"
            placeholder="add a subtitle (optional)."
            onChange={e => setFileSubtitle(e.target.value)}
            value={fileSubtitle}
          />

          <button id="chat-file-uploader-btn" type="submit">
            {fileUploaderLoading ? (
              <WrappedLoading />
            ) : (
              <IconWrapper Icon={SendIcon} className="uploader-btn" />
            )}
          </button>
        </div>
      </form>
    </Overlay>
  );
}
