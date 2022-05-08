import { useState, useEffect, useCallback } from "react";

import "./chatcontent.css";
import ChatOverlayImg from "../ChatOverlayImg";
import { useChat } from "../../../../contexts/ChatContext";
import { useHome } from "../../../../contexts/HomeContext";
import { WrappedLoading } from "../../../../components";
import Message from "./Message";

export default function ChatContent() {
  const { choosenFriend } = useHome();
  const { messages, chatContentLoading } = useChat();

  const [uiMessages, setUIMessages] = useState({
    today: [],
    yesterday: [],
    dated: {},
  });

  const pushChatContentScroll = useCallback(() => {
    const chatContent = document.querySelector("#chat-content");

    chatContent.scrollTop = chatContent.scrollHeight - chatContent.clientHeight;
  }, []);

  const messageMatrix = useCallback(
    props => (
      <Message
        {...props}
        pushChatContentScroll={pushChatContentScroll}
        key={props._id}
      />
    ),
    [pushChatContentScroll]
  );

  const Info = ({ content }) => (
    <p className="chat-content-info-msg">{content}</p>
  );

  useEffect(() => {
    if (choosenFriend && messages) pushChatContentScroll();
  }, [choosenFriend, messages, uiMessages, pushChatContentScroll]);

  useEffect(() => {
    if (!messages || !messages.dated) return;

    const toAndYesterdayUIMsgs = Object.entries({
      today: messages.today,
      yesterday: messages.yesterday,
    }).reduce((acc, [key, value]) => {
      acc[key] = value.map(messageMatrix);

      return acc;
    }, {});

    const datedUIMsgs = messages.dated
      .reduce((acc, msg) => {
        acc.push(msg.createdAt[0]);

        return acc;
      }, [])
      .filter((date, i, dates) => dates.indexOf(date) === i)
      .reduce((acc, date) => {
        acc[date] = messages.dated
          .filter(msg => msg.createdAt[0] === date)
          .map(messageMatrix);

        return acc;
      }, {});

    setUIMessages({ ...toAndYesterdayUIMsgs, dated: datedUIMsgs });
  }, [messages, messageMatrix]);

  return (
    <main id="chat-content">
      {chatContentLoading ? (
        <WrappedLoading />
      ) : (
        <>
          <ChatOverlayImg />

          {Object.entries(uiMessages.dated).map(([key, uiMsgs]) => (
            <>
              {uiMsgs}
              <Info content={key} />
            </>
          ))}
          {uiMessages.yesterday}
          {uiMessages.yesterday.length ? <Info content="yesterday" /> : null}
          {uiMessages.today}
        </>
      )}
    </main>
  );
}
