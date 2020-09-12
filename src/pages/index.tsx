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

function MessagesWidget() {
  const { messages } = useChatState();
  const { pushMessage, showOptions, addListener } = useChatDispatch();

  function showCSat(setCtx) {
    setCtx(null);
    setTimeout(() => {
      pushMessage("Como você classifica o meu atendimento?", "bot");
      showOptions([
        "Muito satisfeito(a)! Minha solicitação foi atendida.",
        "Indiferente",
        "Pouco satisfeito(a). Minha solicitação não foi atendida.",
      ]);
    }, 1000);
  }

  function finishChat(setCtx) {
    setCtx(null);
    setTimeout(() => {
      pushMessage(
        "Conte com o Safra! Estamos com você nos momentos mais importantes.",
        "bot"
      );
      pushMessage("Posso ajudar em algo mais?", "bot");
      showOptions([
        "Relatório",
        "Dica",
        "Renegociação",
        "Estou bem, obrigado(a)",
      ]);
    }, 1000);
  }

  useEffect(() => {
    pushMessage("Olá, sou a Sofia, como posso te ajudar?", "bot");
    showOptions(["Relatório", "Dica", "Renegociação"]);
    addListener((msg, ctx, setCtx) => {
      if (msg === "Relatório") {
        pushMessage("O seu relatório mensal está aqui", "bot");
        pushMessage("...[Relatório]", "bot");
        pushMessage("Quer conferir análises exclusivas?", "bot");
        setCtx("conferir-analises");
        showOptions(["Sim", "Não"]);
      }
      if (msg === "Dica" || (msg === "Sim" && ctx === "conferir-analises")) {
        pushMessage(
          "Estas são as morning calls selecionadas para você:",
          "bot"
        );
        pushMessage(
          "Para outras análises, consulte nossos especialistas 😁",
          "bot"
        );
        showCSat(setCtx);
      }
      if (msg === "Renegociação" || (msg === "Sim" && ctx === "renegociar")) {
        pushMessage("Vou analisar a sua solicitação", "bot");
        setTimeout(() => {
          pushMessage("Foi aprovada! 😉", "bot");
          pushMessage("Escolhar uma opção:", "bot");
          showOptions([
            "Congelar dívida por 3 meses com juros pré-definidos",
            "Congelar dívida por 6 meses com juros pré-definidos",
            "Cancelar",
          ]);
        }, 1000);
      }

      if (msg.indexOf("Congelar dívida") === 0) {
        pushMessage("Sua dívida foi renegociada!", "bot");
        pushMessage("O protocolo da solicitação é #1382", "bot");
        showCSat(setCtx);
      }

      if (msg === "Cancelar") {
        pushMessage("Sua renegociação foi cancelada.", "bot");
        showCSat(setCtx);
      }

      if (msg === "Não") showCSat(setCtx);

      if (msg === "Estou bem, obrigado(a)") {
        pushMessage("Então até mais, estou por aqui se precisar!", "bot");
      }

      if (msg.indexOf("Pouco satisfeito") === 0 || msg === "Indiferente") {
        pushMessage("É uma pena ouvir isso", "bot");
        pushMessage(
          "Nossa equipe está trabalhando para que eu possa melhorar nossa interação por aqui.",
          "bot"
        );
        finishChat(setCtx);
      }

      if (msg.indexOf("Muito satisfeito") === 0) {
        finishChat(setCtx);
      }
    });
  }, []);

  useEffect(() => {
    if (messages.length === 0) return;

    const elements = document.querySelectorAll(".messages-area > *");
    const last = elements[elements.length - 1];
    last.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
