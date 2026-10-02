const ESTILOS = {
  erro: "border-brick-700/30 bg-brick-100 text-brick-700",
  aviso: "border-brand-600/30 bg-brand-100 text-brand-700",
  sucesso: "border-sage-700/30 bg-sage-100 text-sage-700",
  info: "border-ink-600/25 bg-ink-100 text-ink-800",
};

export default function Alert({ tipo = "info", titulo, children, onFechar }) {
  return (
    <div className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${ESTILOS[tipo]}`}>
      <div className="flex-1">
        {titulo && <p className="font-semibold">{titulo}</p>}
        {children && <div className="mt-0.5 opacity-90">{children}</div>}
      </div>
      {onFechar && (
        <button onClick={onFechar} className="shrink-0 opacity-60 hover:opacity-100" aria-label="Fechar">
          ✕
        </button>
      )}
    </div>
  );
}
