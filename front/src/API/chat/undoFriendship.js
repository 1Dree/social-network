export default async function undoFriendship(user, data) {
    const response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}chat/remove-friend`,
      {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${user.tokens.access}`,
          refreshtoken: user.tokens.refresh,
          userid: user._id,
        },
        body: JSON.stringify(data),
      }
    );

    const resData = await response.json();

    if (response.status !== 200)
      throw new Error(resData || response.statusText);
}
