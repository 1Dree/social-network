import { createContext, useContext, useEffect, useState } from "react";
import { clearState } from "../lib";
import { useSocket } from "./SocketContext";
import API from "../API";
import { onDefineProfileObj } from "../API/apiLib";
import { WrappedLoading } from "../components";
import useLoading from "../lib/useLoading";

import { duplicateVerifier } from "../lib";

import { useNavigate } from "react-router-dom";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

const initialUserState = {
  _id: "",
  mailbox: "",
  login: {
    name: "",
    email: "",
    profile: "default",
  },
  friends: [],
  invitations: {
    sended: [],
    received: [],
  },
  tokens: {
    access: "",
    refresh: "",
  },
};

export default function UserProvider({ children }) {
  const [user, setUser] = useState(initialUserState);
  const [socketAuth, setSocketAuth] = useState({
    userId: "",
    tokens: {
      access: "",
      refresh: "",
    },
  });
  const [prevIntervalId, setPrevIntervalId] = useState(null);
  const [expiredAccess, setExpiredAccess] = useState(false);

  const { loading, loadingStateSwitch, LoadingComponent } = useLoading();

  const { socket, connSocket } = useSocket();

  const navigate = useNavigate();

  const userStateSetter = newState => {
    setUser(prevState => ({ ...prevState, ...newState }));
  };

  const clearUserState = clearState(initialUserState, setUser);

  const removeInvit = type => invitId =>
    setUser(prevState => ({
      ...prevState,
      invitations: {
        ...prevState.invitations,
        [type]: prevState.invitations[type].filter(
          ({ _id }) => _id !== invitId
        ),
      },
    }));

  const removeFriend = friendId =>
    setUser(prevState => ({
      ...prevState,
      friends: prevState.friends.filter(({ _id }) => _id !== friendId),
    }));

  const setInvitStatus = (invitId, status) => {
    setUser(prevState => ({
      ...prevState,
      invitations: {
        ...prevState.invitations,
        sended: prevState.invitations.sended.map(invit => {
          if (invit._id === invitId) invit.status = status;

          return invit;
        }),
      },
    }));
  };

  const value = {
    user,
    setUser,
    userStateSetter,
    clearUserState,
    removeInvit,
    removeFriend,
    setInvitStatus,
    socketAuth,
    expiredAccess,
    setExpiredAccess,
  };

  useEffect(() => {
    const userId = sessionStorage.getItem("userid");
    const accessToken = sessionStorage.getItem("accessToken");
    const refreshToken = sessionStorage.getItem("refreshToken");
    if (!userId || !accessToken || !refreshToken || user._id) return;

    const fetchUser = async () => {
      loadingStateSwitch();

      try {
        let data = await API.account.onFetchUser(
          userId,
          accessToken,
          refreshToken
        );

        sessionStorage.setItem("accessToken", data.tokens.access);

        const defineProfileObj = onDefineProfileObj(data.tokens.access);
        const friendsPromises = data.friends.map(defineProfileObj);

        data.friends = await Promise.all(friendsPromises);
        data.login = await defineProfileObj(data.login);

        setUser(data);
        connSocket();
        navigate("/home");
      } catch (err) {
        console.log(err);
      } finally {
        loadingStateSwitch();
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!user._id) return;

    const onVerifyAccess = () => {
      if (prevIntervalId) clearInterval(prevIntervalId);

      const id = setInterval(async () => {
        try {
          await API.account.verifyAccess(user);
        } catch (err) {
          setExpiredAccess(true);
          navigate("/expired-access");
          clearInterval(id);
          clearInterval(prevIntervalId);
          clearUserState();
        }
      }, 5000);

      setPrevIntervalId(id);
    };

    setSocketAuth(prevState => ({
      ...prevState,
      userId: user._id,
      tokens: user.tokens,
    }));
    onVerifyAccess();
  }, [user]);

  useEffect(() => {
    if (!socketAuth.userId) return;

    socket.emit("join_room", {
      header: {
        room: user.mailbox,
        roomAction: "join",
        auth: socketAuth,
      },
    });
  }, [socket, user, socketAuth]);

  useEffect(() => {
    if (!socket) return;

    socket.on("receive_lt_msg", ({ ltMsg }) => {
      setUser(prevState => {
        const friends = prevState.friends.map(friend => {
          if (friend._id === ltMsg.author) friend.ltMsg = ltMsg;

          return friend;
        });

        return {
          ...prevState,
          friends,
        };
      });
    });

    socket.on("reply", async reply => {
      let { friends } = reply;

      if (friends) {
        const defineProfileObj = onDefineProfileObj(reply.accessToken);
        const friendsPromises = friends.map(defineProfileObj);
        friends = await Promise.all(friendsPromises);

        setUser(prevState => ({
          ...prevState,
           friends,
          tokens: { ...prevState.tokens, access: reply.accessToken },
        }));
      } else {
        setUser(prevState => ({
          ...prevState,
          tokens: { ...prevState.tokens, access: reply.accessToken },
        }));
      }

      return;
    });

    return;
  }, [socket]);

  return (
    <UserContext.Provider value={value}>
      {loading ? <LoadingComponent /> : children}
    </UserContext.Provider>
  );
}
