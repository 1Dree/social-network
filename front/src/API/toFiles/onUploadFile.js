export default async function onUploadFile(
  setUser,
  formData,
  subtitle,
  user,
  type,
  chatRoom
) {
  const { access, refresh } = user.tokens;

  try {
    const response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}chat/upload-file?userId=${user._id}&subtitle=${subtitle}&type=${type}&chatRoom=${chatRoom}`,
      {
        method: "post",
        headers: {
          Authorization: `Bearer ${access}`,
          refreshToken: refresh,
          userId: user._id,
        },
        body: formData,
      }
    );

    const data = await response.json();

    if (response.status !== 200) throw new Error(data || response.statusText);

    setUser(prevState => ({
      ...prevState,
      tokens: {
        ...prevState.tokens,
        access: data.accessToken,
      },
    }));

    return data.messageDoc;
  } catch (err) {
    console.log(err);

    throw err;
  }
}
