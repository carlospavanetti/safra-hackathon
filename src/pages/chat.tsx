import React, { useEffect, useState, useCallback } from "react";
import { SendOutlined } from "@ant-design/icons";
import ChatProvider, { useChatState, useChatDispatch } from "services/Chat";
import useDialog from "services/Dialog";

export default function ChatPage() {
  return (
    <div className="chat-page">
      <ChatProvider>
        <div className="chat-area">
          <div className="chat-header">
            <h2 className="title">Sofia</h2>
            <h2 className="tagline">A sua assistente financeira</h2>
          </div>
          <div className="scrollable-area">
            <MessagesWidget />
          </div>
          <div className="input-area">
            <input className="input" placeholder="Digite aqui sua mensagem" />
            <SendOutlined className="sendbutton" />
          </div>
        </div>
      </ChatProvider>
    </div>
  );
}

function useScrollToLast(messages) {
  useEffect(() => {
    if (messages.length === 0) return;

    const elements = document.querySelectorAll(".messages-area > *");
    const last = elements[elements.length - 1];
    last.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
}

function MessagesWidget() {
  const { messages } = useChatState();
  const { pushMessage } = useChatDispatch();

  useDialog();
  useScrollToLast(messages);

  return (
    <MessageArea
      messages={messages}
      pushAsUser={(msg) => pushMessage(msg, "user")}
    />
  );
}

function MessageArea({ messages, pushAsUser }) {
  return (
    <div className="messages-area">
      {messages.map((item, idx) => {
        if (item.type === "options")
          return (
            <OptionsGroup
              key={idx}
              options={item.options}
              onSelect={pushAsUser}
            />
          );

        if (item.type === "message")
          return (
            <div key={idx} className={`message -${item.origin}`}>
              {item.message}
            </div>
          );
      })}
    </div>
  );
}

function OptionsGroup({ options, onSelect }) {
  const [selected, setSelected] = useState(false);
  const selectOption = useCallback(
    (option) => {
      if (selected) return;

      setSelected(true);
      onSelect(option);
    },
    [selected]
  );

  return (
    <div className="options-group">
      {options.map((option) => (
        <button
          key={option}
          className="option"
          onClick={() => selectOption(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
