import { onRes } from "../apiLib";

export default async function onPhotoUpdate(user, formData) {
  const query =
    user.login.profile.path !== "default"
      ? `?prevPhotoFilename=${user.login.profile.path}`
      : "";

  const response = await fetch(
    `${process.env.REACT_APP_SERVER_URL}account/change-photo${query}`,
    {
      method: "post",
      headers: {
        authorization: "bearer " + user.tokens.access,
        refreshtoken: user.tokens.refresh,
        userid: user._id,
      },
      body: formData,
    }
  );

  return onRes(response);
}
