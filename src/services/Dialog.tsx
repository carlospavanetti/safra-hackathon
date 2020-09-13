import { useEffect } from "react";
import { useChatDispatch } from "./Chat";

function waitForMs(time) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), time);
  });
}

export default function useDialog() {
  const {
    pushMessage,
    showOptions,
    setContext,
    addListener,
  } = useChatDispatch();

  async function showCSat() {
    setContext(null);
    await waitForMs(1000);
    pushMessage("Como você classifica o meu atendimento?", "bot");
    showOptions([
      "Muito satisfeito(a)! Minha solicitação foi atendida.",
      "Indiferente",
      "Pouco satisfeito(a). Minha solicitação não foi atendida.",
    ]);
  }

  async function finishChat() {
    setContext(null);
    await waitForMs(1000);
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
  }

  useEffect(() => {
    pushMessage("Olá, sou a Sofia, como posso te ajudar?", "bot");
    showOptions(["Relatório", "Dica", "Renegociação"]);
    addListener(async (msg, ctx) => {
      if (msg === "Relatório") {
        pushMessage("O seu relatório mensal está aqui", "bot");
        pushMessage("...[Relatório]", "bot");
        pushMessage("Quer conferir análises exclusivas?", "bot");
        setContext("conferir-analises");
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
        showCSat();
      }
      if (msg === "Renegociação" || (msg === "Sim" && ctx === "renegociar")) {
        pushMessage("Vou analisar a sua solicitação", "bot");
        await waitForMs(1000);
        pushMessage("Foi aprovada! 😉", "bot");
        pushMessage("Escolhar uma opção:", "bot");
        showOptions([
          "Congelar dívida por 3 meses com juros pré-definidos",
          "Congelar dívida por 6 meses com juros pré-definidos",
          "Cancelar",
        ]);
      }

      if (msg.indexOf("Congelar dívida") === 0) {
        pushMessage("Sua dívida foi renegociada!", "bot");
        pushMessage("O protocolo da solicitação é #1382", "bot");
        showCSat();
      }

      if (msg === "Cancelar") {
        pushMessage("Sua renegociação foi cancelada.", "bot");
        showCSat();
      }

      if (msg === "Não") showCSat();

      if (msg === "Estou bem, obrigado(a)") {
        pushMessage("Então até mais, estou por aqui se precisar!", "bot");
      }

      if (msg.indexOf("Pouco satisfeito") === 0 || msg === "Indiferente") {
        pushMessage("É uma pena ouvir isso", "bot");
        pushMessage(
          "Nossa equipe está trabalhando para que eu possa melhorar nossa interação por aqui.",
          "bot"
        );
        finishChat();
      }

      if (msg.indexOf("Muito satisfeito") === 0) {
        finishChat();
      }
    });
  }, []);
}
