import React from "react";
import { SendOutlined } from "@ant-design/icons";

export default function ChatPage() {
  const data = [
    {
      type: "message",
      message: "Olá, sou a Sofia, como posso te ajudar?",
      origin: "bot",
    },
    { type: "options", options: ["Relatório", "Dica", "Renegociação"] },
    { type: "message", message: "Renegociação", origin: "user" },
    {
      type: "message",
      message: "Olá, sou a Sofia, como posso te ajudar?",
      origin: "bot",
    },
    { type: "options", options: ["Relatório", "Dica", "Renegociação"] },
    { type: "message", message: "Renegociação", origin: "user" },
  ];

  return (
    <div className="chat-page">
      <div className="chat-area">
        <div className="chat-header">
          <h2 className="title">Sofia</h2>
          <h2 className="tagline">O seu assistente financeiro</h2>
        </div>
        <div className="scrollable-area">
          <MessageArea messages={data} />
        </div>
        <div className="input-area">
          <input className="input" placeholder="Digite aqui sua mensagem" />
          <SendOutlined className="sendbutton" />
        </div>
      </div>
    </div>
  );
}

function MessageArea({ messages }) {
  return (
    <div className="messages-area">
      {messages.map((item) => {
        if (item.type === "options")
          return <OptionsGroup options={item.options} />;

        if (item.type === "message")
          return (
            <div className={`message -${item.origin}`}>{item.message}</div>
          );
      })}
    </div>
  );
}

function OptionsGroup({ options }) {
  return (
    <div className="options-group">
      {options.map((option) => (
        <button className="option">{option}</button>
      ))}
    </div>
  );
}
