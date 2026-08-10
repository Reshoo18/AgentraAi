import React, { useEffect } from "react";
import Nav from "./Nav";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import { useDispatch, useSelector } from "react-redux";
import getMessages from "../features/getMessages";
import { setArtifacts, setMessages } from "../redux/messageSlice";

const ChatArea = () => {
  const { selectedConversation } = useSelector(
    (state) => state.conversation
  );

  const dispatch = useDispatch();

  useEffect(() => {
    const getMsg = async () => {
      try {
        if (!selectedConversation) return;

        if (selectedConversation.title === "New chat") return;

        const data = await getMessages(selectedConversation._id);

        console.log("MESSAGES:", data);

        if (!Array.isArray(data)) {
          dispatch(setMessages([]));
          dispatch(setArtifacts([]));
          return;
        }

        dispatch(setMessages(data));

        const latestArtifactMessage = [...data]
          .reverse()
          .find(
            (msg) =>
              Array.isArray(msg?.artifacts) &&
              msg.artifacts.length > 0
          );

        dispatch(
          setArtifacts(latestArtifactMessage?.artifacts || [])
        );
      } catch (error) {
        console.error("GET MESSAGES ERROR:", error);
        dispatch(setMessages([]));
        dispatch(setArtifacts([]));
      }
    };

    getMsg();
  }, [selectedConversation?._id]);

  return (
    <div className="flex flex-col h-full">
      <Nav />
      <MessageList />
      <ChatInput />
    </div>
  );
};

export default ChatArea;