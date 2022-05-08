const downloadFile = async (filename, user) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}chat/download-file?filename=${filename}`,
      {
        method: "get",
        headers: {
          authorization: `Bearer ${user.tokens.access}`,
          refreshToken: user.tokens.refresh,
          userid: user._id,
        },
      }
    );

    if (response.status !== 200) throw new Error(response.statusText);

    return response.body;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default downloadFile;
