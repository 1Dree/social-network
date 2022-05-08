import { onDefineProfileObj } from "../apiLib";

export default async function onGetContacts(setUser, user, setContacts) {
  const response = await fetch(
    `${process.env.REACT_APP_SERVER_URL}chat/retrieve-contacts/?userId=${user._id}`,
    {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        authorization: `bearer ${user.tokens.access}`,
        refreshToken: user.tokens.refresh,
        userid: user._id,
      },
    }
  );

  const data = await response.json();

  if (response.status !== 200) throw new Error(data || response.statusText);

  const defineProfileObj = onDefineProfileObj(data.accessToken);

  const contactsPromises = data.contacts.map(defineProfileObj);

  data.contacts = await Promise.all(contactsPromises);

  setUser(prevState => ({
    ...prevState,
    tokens: { ...prevState.tokens, access: data.accessToken },
  }));
  setContacts(data.contacts);
}
