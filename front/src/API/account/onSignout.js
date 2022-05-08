export default async function onSignout(user, userData) {
  const response = await fetch(
    `${process.env.REACT_APP_SERVER_URL}account/signout`,
    {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        authorization: "bearer " + user.tokens.access,
        refreshtoken: user.tokens.refresh,
        userid: user._id,
      },
      body: JSON.stringify({ userData }),
    }
  );

  if (response.status !== 200) throw new Error(response.statusText);

  sessionStorage.removeItem("userid");
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
}
