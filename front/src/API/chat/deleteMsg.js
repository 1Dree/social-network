export default async function deleteMsg(props) {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}chat/delete-msg`,
      {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
          authorization: "bearer " + props.user.tokens.access,
          refreshtoken: props.user.tokens.refresh,
          userid: props.user._id,
        },
        body: JSON.stringify(props.data),
      }
    );

    const data = await response.json();

    if (response.status !== 200) throw new Error(data || response.statusText);
  } catch (err) {
    console.log(err);
  }
}
