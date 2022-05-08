import { onDefineProfileObj } from "../apiLib";

export default async function onFetInvits(setUser, user) {
  const response = await fetch(
    `${process.env.REACT_APP_SERVER_URL}invit/get-invitations/${user._id}`,
    {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        authorization: "bearer " + user.tokens.access,
        refreshtoken: user.tokens.refresh,
        userid: user._id,
      },
    }
  );

  const data = await response.json();

  if (response.status !== 200) throw new Error(data || response.statusText);

  let { invitations } = data;

  const defineProfileObj = onDefineProfileObj(data.accessToken);
  const [sendedInvitsPromises, receivedInvitsPromises] = [
    invitations.sended.map(defineProfileObj),
    invitations.received.map(defineProfileObj),
  ];

  invitations = {
    sended: await Promise.all(sendedInvitsPromises),
    received: await Promise.all(receivedInvitsPromises),
  };

  setUser(prevState => ({
    ...prevState,
    invitations: { ...prevState.invitations, ...invitations },
    tokens: { ...prevState.tokens, access: data.accessToken },
  }));
}
