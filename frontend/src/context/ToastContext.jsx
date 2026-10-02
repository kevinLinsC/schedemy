import { createContext, useCallback, useContext, useRef, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const proximoId = useRef(0);

  const remover = useCallback((id) => {
    setToasts((atual) => atual.filter((t) => t.id !== id));
  }, []);

  const notificar = useCallback(
    (mensagem, tipo = "info", duracaoMs = 4500) => {
      const id = ++proximoId.current;
      setToasts((atual) => [...atual, { id, mensagem, tipo }]);
      if (duracaoMs) setTimeout(() => remover(id), duracaoMs);
      return id;
    },
    [remover]
  );

  const toast = {
    sucesso: (msg) => notificar(msg, "sucesso"),
    erro: (msg) => notificar(msg, "erro", 7000),
    info: (msg) => notificar(msg, "info"),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex w-full max-w-sm flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto animate-[fadeIn_.15s_ease-out] rounded-xl border px-4 py-3 text-sm shadow-lift ${
              t.tipo === "erro"
                ? "border-brick-700/30 bg-brick-700 text-white"
                : t.tipo === "sucesso"
                ? "border-sage-700/30 bg-sage-700 text-white"
                : "border-ink-900/20 bg-ink-900 text-white"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <span className="leading-snug">{t.mensagem}</span>
              <button
                className="shrink-0 opacity-70 hover:opacity-100"
                onClick={() => remover(t.id)}
                aria-label="Fechar notificação"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast deve ser usado dentro de um ToastProvider");
  return ctx;
}
