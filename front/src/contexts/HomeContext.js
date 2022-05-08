import { createContext, useContext, useEffect, useState } from "react";
import { useSocket } from "./SocketContext";
import { useUser } from "./UserContext";

const HomeContext = createContext();

export const useHome = () => useContext(HomeContext);

const chosenFriendInitialState = {
  _id: "",
  name: "",
  profile: "",
  chatRoom: "",
  mailbox: "",
};

export default function HomeContextProvider({ children }) {
  const { socket } = useSocket();
  const { removeFriend } = useUser();

  const [chosenFriend, setChosenFriend] = useState(chosenFriendInitialState);

  const chosenFriendSetter = friendInfo =>
    setChosenFriend(prevState => ({ ...prevState, ...friendInfo }));

  const clearChosenFriend = () => setChosenFriend(chosenFriendInitialState);

  const toggleClass = (target, className) => {
    const elTarget = document.querySelector(target);

    elTarget.classList.toggle(className);
  };

  const activeHeaderOpts = () =>
    toggleClass("#home-header-options-modal", "active");

  const slideContacts = () => {
    toggleClass("#contacts", "slide");
  };

  const removeClassOnExternalClick = (el, elClass) => {
    const element = typeof el === "string" ? document.querySelector(el) : el;

    const essentialAction = e => {
      if (!element.contains(e.target)) {
        element.classList.remove(elClass);
        window.removeEventListener("click", essentialAction);
      }
    };

    const addClickEvent = () => {
      window.addEventListener("click", essentialAction);
      element.removeEventListener("transitionend", addClickEvent);
    };

    element.addEventListener("transitionend", addClickEvent);
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("remove_friend", ({ friendId }) => {
      if (friendId === chosenFriend._id) {
        setChosenFriend(chosenFriendInitialState);
      }

      removeFriend(friendId);

      return;
    });
  }, [socket, chosenFriend, removeFriend]);

  const value = {
    activeHeaderOpts,
    slideContacts,
    toggleClass,
    removeClassOnExternalClick,
    chosenFriendInitialState,
    chosenFriend,
    chosenFriendSetter,
    clearChosenFriend,
  };

  return <HomeContext.Provider value={value}>{children}</HomeContext.Provider>;
}
