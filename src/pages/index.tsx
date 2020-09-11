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
        <div className="messages-area">
          <div className="message -bot">
            Olá, sou a Sofia, como posso te ajudar?
          </div>
          <div className="options-group">
            <button className="option">Relatório</button>
            <button className="option">Dica</button>
            <button className="option">Renegociação</button>
          </div>
          <div className="message -user">Renegociação</div>
          <div className="message -bot">
            Pois bem, para renegociação preciso consultar o fluxograma da Carol.
          </div>
        </div>
        <div className="input-area">
          <input className="input" placeholder="Digite aqui sua mensagem" />
          <SendOutlined className="sendbutton" />
        </div>
      </div>
    </div>
  );
}
