import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function Modal({ aberto, titulo, subtitulo, onFechar, largura = "max-w-lg", children }) {
  useEffect(() => {
    if (!aberto) return;
    const aoTeclar = (e) => e.key === "Escape" && onFechar?.();
    document.addEventListener("keydown", aoTeclar);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", aoTeclar);
      document.body.style.overflow = "";
    };
  }, [aberto, onFechar]);

  if (!aberto) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink-950/50 px-4 py-8 backdrop-blur-[2px]">
      <div
        className={`w-full ${largura} animate-[fadeIn_.15s_ease-out] rounded-2xl bg-white shadow-lift`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-ink-100 px-6 py-5">
          <div>
            <h2 className="font-display text-xl text-ink-900">{titulo}</h2>
            {subtitulo && <p className="mt-0.5 text-sm text-ink-700/70">{subtitulo}</p>}
          </div>
          <button
            onClick={onFechar}
            className="rounded-full p-1.5 text-ink-700/60 hover:bg-ink-100 hover:text-ink-900"
            aria-label="Fechar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>,
    document.body
  );
}
