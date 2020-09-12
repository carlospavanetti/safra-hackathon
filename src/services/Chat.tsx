import { createContext, useCallback, useContext, useState } from "react";

const ChatStateContext = createContext({});
const ChatDispatchContext = createContext({});

export default function ChatProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [listeners, setListeners] = useState([]);
  const [context, setContext] = useState();

  const pushMessage = useCallback(
    (message, origin) => {
      setMessages((m) => [...m, { type: "message", message, origin }]);
      if (origin === "user") {
        listeners.forEach((cb) => cb(message, context, setContext));
      }
    },
    [listeners]
  );
  const showOptions = useCallback((options) => {
    setMessages((m) => [...m, { type: "options", options }]);
  }, []);
  const addListener = useCallback((callback) => {
    setListeners((cbs) => [...cbs, callback]);
  }, []);

  return (
    <ChatDispatchContext.Provider
      value={{ addListener, pushMessage, showOptions }}
    >
      <ChatStateContext.Provider value={{ messages }}>
        {children}
      </ChatStateContext.Provider>
    </ChatDispatchContext.Provider>
  );
}

export function useChatState() {
  const context = useContext(ChatStateContext);
  if (context === undefined)
    throw new Error("useChatState must be used within a ChatProvider");
  return context;
}

export function useChatDispatch() {
  const context = useContext(ChatDispatchContext);
  if (context === undefined)
    throw new Error("useChatDispatch must be used within a ChatProvider");
  return context;
}
