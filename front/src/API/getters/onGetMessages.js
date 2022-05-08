import { msgsMomentFormatter, msgjwtDecoder } from "../../lib";

export default async function onGetMessages(
  user,
  setUser,
  setMessages,
  chatRoom
) {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}chat/retrieve-msgs?userId=${user._id}&roomId=${chatRoom}`,
      {
        method: "get",
        headers: {
          authorization: `Bearer ${user.tokens.access}`,
          refreshToken: user.tokens.refresh,
          userid: user._id,
        },
      }
    );

    const data = await response.json();

    if (response.status !== 200) throw new Error(data || response.statusText);

    const nowDate = new Date();
    const [thisDate, thisMonth, thisYear] = [
      nowDate.getDate(),
      nowDate.getMonth(),
      nowDate.getYear(),
    ];

    const configMessages = data.messages
      .map(msg => {
        const { result, date } = msgsMomentFormatter(msg.createdAt);

        msg.createdAt = result;
        msg.moment = {
          date: date.getDate(),
          month: date.getMonth(),
          year: date.getYear(),
        };
        if (msg.type === "text") msg.content = msgjwtDecoder(msg.content);

        return msg;
      })
      .reduce(
        (acc, msg) => {
          const { date, month, year } = msg.moment;
          const sameContext = month === thisMonth && year === thisYear;
          const [today, yesterday] = [
            date === thisDate && sameContext,
            date + 1 === thisDate && sameContext,
          ];

          let accKey = today ? "today" : yesterday ? "yesterday" : !sameContext;
          accKey = accKey || "dated";

          acc[accKey] = [...acc[accKey], msg];

          return acc;
        },
        { today: [], yesterday: [], dated: [] }
      );

    setUser(prevState => ({
      ...prevState,
      tokens: { ...prevState.tokens, access: data.accessToken },
    }));

    setMessages(configMessages);
  } catch (err) {
    console.log(err);
    throw err;
  }
}
