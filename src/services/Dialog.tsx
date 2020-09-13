import { YoutubeOutlined } from "@ant-design/icons";
import React, { useEffect } from "react";
import { fetchMorningCalls, fetchReport } from "./Api";
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

  async function reportListener(msg, ctx) {
    if (msg === "Relatório") {
      const report = await fetchReport();
      const iframe = (
        <iframe
          src={report}
          frameBorder={0}
          width={360}
          height={1250}
          scrolling="no"
        />
      );
      pushMessage("O seu relatório mensal está aqui", "bot");
      await waitForMs(750);
      pushMessage(iframe);
      await waitForMs(4000);
      pushMessage("Quer conferir análises exclusivas?", "bot");
      setContext("conferir-analises");
      showOptions(["Sim", "Não"]);
    }
  }

  async function tipListener(msg, ctx) {
    if (msg === "Dica" || (msg === "Sim" && ctx === "conferir-analises")) {
      const calls = await fetchMorningCalls();
      const links = calls.map((c) => (
        <div className="morning-call">
          <div className="morningcall-header">
            <a className="link" href={c.links[0].href}>
              {c.title}
            </a>
            <YoutubeOutlined className="symbol" />
          </div>
          <p className="description">{c.description}</p>
        </div>
      ));
      pushMessage("Estas são as morning calls selecionadas para você:", "bot");
      links.forEach((link) => pushMessage(link, "bot"));
      pushMessage(
        "Para outras análises, consulte nossos especialistas 😁",
        "bot"
      );
      await waitForMs(4000);
      showCSat();
    }
  }

  async function renegotiationListener(msg, ctx) {
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
  }

  function satisfactionListener(msg, ctx) {
    if (msg === "Estou bem, obrigado(a)") {
      pushMessage("Até mais, estou por aqui se precisar!", "bot");
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
  }

  useEffect(() => {
    async function dialog() {
      await waitForMs(1500);
      pushMessage("Olá, sou a Sofia, como posso te ajudar?", "bot");
      await waitForMs(1000);
      showOptions(["Relatório", "Dica", "Renegociação"]);
    }
    addListener(reportListener);
    addListener(tipListener);
    addListener(renegotiationListener);
    addListener(satisfactionListener);
    addListener((msg, ctx) => {
      if (msg === "Não") showCSat();
    });

    dialog();
  }, []);
}
