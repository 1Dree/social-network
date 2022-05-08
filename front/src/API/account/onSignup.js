import { onRes, onDefineProfileObj } from "../apiLib";

export default async function onSignup(setUser, login, socket) {
  const response = await fetch(
    `${process.env.REACT_APP_SERVER_URL}account/signup`,
    {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ login }),
    }
  );

  const data = await onRes(response);

  const defineProfileObj = onDefineProfileObj(data.tokens.access);

  data.login = await defineProfileObj(data.login);

  socket.emit("join_room", {
    header: {
      roomAction: "join",
      room: data.mailbox,
    },
  });

  socket.emit("new_contact", {
    contact: {
      _id: data._id,
      name: data.login.name,
      maildrop: data.mailbox,
      profile: data.login.profile.path,
    },
  });

  sessionStorage.setItem("userid", data._id);
  sessionStorage.setItem("accessToken", data.tokens.access);
  sessionStorage.setItem("refreshToken", data.tokens.refresh);
  setUser(prevState => ({ ...prevState, ...data }));
}
