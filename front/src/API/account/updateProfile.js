import { onRes } from "../apiLib";

export default async function updateProfile(user, setUser, update) {
  const response = await fetch(
    `${process.env.REACT_APP_SERVER_URL}account/update-profile`,
    {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        authorization: "bearer " + user.tokens.access,
        refreshtoken: user.tokens.refresh,
        userid: user._id,
      },
      body: JSON.stringify({ update }),
    }
  );

  const data = await onRes(response);

  setUser(prevState => ({
    ...prevState,
    login: { ...prevState.login, ...data.login },
    tokens: { ...prevState.tokens, ...data.tokens },
  }));
}
