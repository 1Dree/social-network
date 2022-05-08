import { onRes } from "../apiLib";

export default async function onFetchUser(userId, accessToken, refreshToken) {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}account/retrieve-user?userid=${userId}`,
      {
        method: "get",
        headers: {
          authorization: "bearer " + accessToken,
          refreshtoken: refreshToken,
          userid: userId,
        },
      }
    );

    return onRes(response);
  } catch (err) {
    console.log(err);
  }
}
