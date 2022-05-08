import { onDefineProfileObj } from "../apiLib";

export default async function onLogin(setUser, login, socket) {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}account/login`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login }),
      }
    );

    let data = await response.json();

    if (response.status !== 200) throw new Error(data || response.statusText);

    socket.emit("join_room", {
      header: {
        roomAction: "join",
        room: data.mailbox,
      },
    });

    const defineProfileObj = onDefineProfileObj(data.tokens.access);
    const friendsPromises = data.friends.map(defineProfileObj);

    data.friends = await Promise.all(friendsPromises);
    data.login = await defineProfileObj(data.login);

    sessionStorage.setItem("userid", data._id);
    sessionStorage.setItem("accessToken", data.tokens.access);
    sessionStorage.setItem("refreshToken", data.tokens.refresh);
    setUser(data);
  } catch (err) {
    console.log(err);
  }
}
