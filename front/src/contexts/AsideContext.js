import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { useSocket } from "./SocketContext";
import { useUser } from "./UserContext";
import { useHome } from "./HomeContext";
import { duplicateVerifier, arrayStateSetterDuplicatePreventer } from "../lib";
import { onDefineProfileObj } from "../API/apiLib";
import useLoading from "../lib/useLoading";

export const AsideContext = createContext();

export const useAside = () => useContext(AsideContext);

export default function AsideContextProvider({ children }) {
  const { choosenFriend, clearChoosenFriend } = useHome();

  const [contacts, setContacts] = useState([]);
  const [chatRoom, setChatRoom] = useState("");
  const [asideSearchContent, setAsideSearchContent] = useState("");
  const [contactsSearchContent, setContactsSearchContent] = useState("");

  const { socket } = useSocket();
  const { user, setUser, removeInvit, setInvitStatus } = useUser();

  const loadingData = useLoading();

  const removeContact = contactId => {
    setContacts(prevContacts =>
      prevContacts.filter(({ _id }) => _id !== contactId)
    );
  };

  const onInvitContactsEffect = item =>
    arrayStateSetterDuplicatePreventer(item, setContacts);

  const onInvitUserEffect = invitType => item => {
    setUser(prevState => {
      const effectSubject = invitType
        ? prevState.invitations[invitType]
        : prevState.friends;
      const effectUpdate = invitType
        ? {
            invitations: {
              ...prevState.invitations,
              received: [...effectSubject, item],
            },
          }
        : {
            friends: [...effectSubject, item],
          };

      if (duplicateVerifier(effectSubject, item._id)) return prevState;

      return {
        ...prevState,
        ...effectUpdate,
      };
    });
  };
  const onInvit = (itemKey, removeItem, stateUpdate) => async data => {
    try {
      let item = data[itemKey];
      const defineProfileObj = onDefineProfileObj(user.tokens.access);

      item = await defineProfileObj(item);

      if (removeItem) removeItem(item._id);

      stateUpdate(item);
    } catch (err) {
      console.log(err);
    }
  };

  const findContactPlace = useCallback(
    contactId => {
      const {
        invitations: { sended, received },
        friends,
      } = user;
      const possiblePlaces = Object.entries({
        contacts,
        sended,
        received,
        friends,
      });

      const [foundPlace] = possiblePlaces
        .map(([key, value]) => {
          if (value.some(item => item._id === contactId)) return key;

          return null;
        })
        .filter(value => value);

      return foundPlace;
    },
    [user, contacts]
  );

  const onContactUpdate = useCallback(
    async (contactPropKey, { contact }) => {
      const { _id } = contact;
      const contactPlace = findContactPlace(_id);
      if (!contactPlace) return;
      let prop;

      if (contactPropKey === "profile") {
        const defineProfileObj = onDefineProfileObj(user.tokens.access);
        const { profile } = await defineProfileObj(contact);

        prop = profile;
      } else {
        prop = contact[contactPropKey];
      }

      const updateItem = item => {
        if (item._id === _id) item[contactPropKey] = prop;

        return item;
      };

      switch (contactPlace) {
        case "contacts":
          setContacts(prevContacts => prevContacts.map(updateItem));
          break;

        case "friends":
          setUser(prevState => ({
            ...prevState,
            friends: prevState.friends.map(updateItem),
          }));
          break;

        default:
          setUser(prevState => ({
            ...prevState,
            invitations: {
              ...prevState.invitations,
              ...prevState.invitations[contactPlace].map(updateItem),
            },
          }));
      }

      return;
    },
    [setContacts, setUser, findContactPlace]
  );

  useEffect(() => {
    let mount = true;

    if (!mount || !socket) return;

    socket.on("new_contact", onInvit("contact", null, onInvitContactsEffect));

    socket.on(
      "receive_invit",
      onInvit("inviter", removeContact, onInvitUserEffect("received"))
    );

    socket.on(
      "canceled_invit",
      onInvit("inviter", removeInvit("received"), onInvitContactsEffect)
    );

    socket.on(
      "rejected_invit",
      onInvit("invitee", removeInvit("sended"), onInvitContactsEffect)
    );

    socket.on(
      "accepted_invit",
      onInvit("friend", removeInvit("sended"), item =>
        setUser(prevState => {
          if (duplicateVerifier(prevState.friends, item._id)) return prevState;

          return {
            ...prevState,
            friends: [...prevState.friends, item],
          };
        })
      )
    );

    socket.on("contact_photo_update", data => onContactUpdate("profile", data));

    socket.on("contact_name_update", data => onContactUpdate("name", data));

    socket.on("delete_contact", ({ contactId }) => {
      const contactPlace = findContactPlace(contactId);
      if (!contactPlace) return;

      const excludeItem = array => array.filter(({ _id }) => _id !== contactId);

      if (choosenFriend._id === contactId) clearChoosenFriend();

      switch (contactPlace) {
        case "contacts":
          setContacts(excludeItem);
          break;

        case "friends":
          setUser(prevState => ({
            ...prevState,
            friends: excludeItem(prevState.friends),
          }));
          break;

        default:
          setUser(prevState => ({
            ...prevState,
            invitations: {
              ...prevState.invitations,
              [contactPlace]: excludeItem(prevState.invitations[contactPlace]),
            },
          }));
      }
    });

    return () => (mount = false);
  }, [
    socket,
    choosenFriend,
    clearChoosenFriend,
    findContactPlace,
    onContactUpdate,
    removeInvit,
    setInvitStatus,
    setUser,
  ]);

  const value = {
    contacts,
    setContacts,
    removeContact,
    chatRoom,
    setChatRoom,
    asideSearchContent,
    setAsideSearchContent,
    contactsSearchContent,
    setContactsSearchContent,
    loadingData,
  };

  return (
    <AsideContext.Provider value={value}>{children}</AsideContext.Provider>
  );
}
