import React, { useEffect, useState, useCallback } from "react";
import { SendOutlined } from "@ant-design/icons";
import ChatProvider, { useChatState, useChatDispatch } from "services/Chat";

export default function ChatPage() {
  return (
    <div className="chat-page">
      <ChatProvider>
        <div className="chat-area">
          <div className="chat-header">
            <h2 className="title">Sofia</h2>
            <h2 className="tagline">O seu assistente financeiro</h2>
          </div>
          <div className="scrollable-area">
            <MessageArea />
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

function MessageArea() {
  const { messages } = useChatState();
  const { pushMessage, showOptions, addListener } = useChatDispatch();

  useEffect(() => {
    pushMessage("Olá, sou a Sofia, como posso te ajudar?", "bot");
    showOptions(["Relatório", "Dica", "Renegociação"]);
    addListener((msg, ctx, setCtx) => {
      if (msg === "Relatório")
        pushMessage("O seu relatório mensal está aqui", "bot");
    });
  }, []);

  return (
    <div className="messages-area">
      {messages.map((item) => {
        if (item.type === "options")
          return <OptionsGroup options={item.options} push={pushMessage} />;

        if (item.type === "message")
          return (
            <div className={`message -${item.origin}`}>{item.message}</div>
          );
      })}
    </div>
  );
}

function OptionsGroup({ options, push }) {
  const [selected, setSelected] = useState(false);
  const selectOption = useCallback(
    (option) => {
      if (selected) return;

      setSelected(true);
      push(option, "user");
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
