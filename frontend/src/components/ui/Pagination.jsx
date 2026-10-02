export default function Pagination({ pagina, onMudarPagina }) {
  if (!pagina || pagina.totalPaginas <= 1) return null;

  const { paginaAtual, totalPaginas, totalElementos, primeira, ultima } = pagina;

  return (
    <div className="flex items-center justify-between gap-4 px-1 py-3 text-sm text-ink-700">
      <span>
        Página <strong className="text-ink-900">{paginaAtual + 1}</strong> de {totalPaginas} ·{" "}
        {totalElementos} registro{totalElementos === 1 ? "" : "s"}
      </span>
      <div className="flex gap-2">
        <button
          className="btn-ghost !px-2.5"
          disabled={primeira}
          onClick={() => onMudarPagina(paginaAtual - 1)}
          aria-label="Página anterior"
        >
          ← Anterior
        </button>
        <button
          className="btn-ghost !px-2.5"
          disabled={ultima}
          onClick={() => onMudarPagina(paginaAtual + 1)}
          aria-label="Próxima página"
        >
          Próxima →
        </button>
      </div>
    </div>
  );
}
