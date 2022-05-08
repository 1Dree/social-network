import "./chatOverlayImg.css";
import { useChat } from "../../../../contexts/ChatContext";
import { Overlay } from "../../../../components";

export default function ChatOverlayImg() {
  const { overlayImg, showOverlayImg, showOverlayImgSwitch } = useChat();

  return (
    <Overlay display={showOverlayImg} displaySwitch={showOverlayImgSwitch}>
      <img src={overlayImg} id="chat-overlay-image" alt="chat" />
    </Overlay>
  );
}
