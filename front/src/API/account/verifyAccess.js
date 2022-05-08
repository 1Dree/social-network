import { onRes } from "../apiLib";

export default async function verifyAccess(user) {
  const response = await fetch(
    `${process.env.REACT_APP_SERVER_URL}account/verify-access`,
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

  await onRes(response);
}
