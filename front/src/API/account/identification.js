import { onRes } from "../apiLib";

export default async function identification(user, setUser, loginData) {
  const response = await fetch(
    `${process.env.REACT_APP_SERVER_URL}account/identification`,
    {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        authorization: "bearer " + user.tokens.access,
        refreshtoken: user.tokens.refresh,
        userid: user._id,
      },
      body: JSON.stringify({ loginData }),
    }
  );

  const data = await onRes(response);

  setUser(prevState => ({
    ...prevState,
    tokens: { ...prevState.tokens, access: data.accessToken },
  }));
}
