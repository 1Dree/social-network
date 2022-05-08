import "./chatheader.css";
import { Profile } from "../../../../components";

import { useHome } from "../../../../contexts/HomeContext";

export default function ChatHeader() {
  const { chosenFriend } = useHome();

  return (
    <header id="chat-header">
      <div id="friend-profile">
        <Profile src={chosenFriend.profile} />
      </div>

      <h3 id="friend-name">{chosenFriend.name}</h3>
    </header>
  );
}
