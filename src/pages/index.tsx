import React from "react";
import { SendOutlined } from "@ant-design/icons";

export default function ChatPage() {
  return (
    <div className="chat-page">
      <div className="chat-area">
        <div className="chat-header">
          <h2 className="title">Sofia</h2>
          <h2 className="tagline">O seu assistente financeiro</h2>
        </div>
        <div className="messages-area"></div>
        <div className="input-area">
          <input className="input" placeholder="Digite aqui sua mensagem" />
          <SendOutlined className="sendbutton" />
        </div>
      </div>
    </div>
  );
}
