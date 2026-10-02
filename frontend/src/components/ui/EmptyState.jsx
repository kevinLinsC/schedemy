export default function EmptyState({ titulo = "Nada por aqui ainda", descricao, acao }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink-100 text-ink-700">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="3.5" y="5.5" width="17" height="15" rx="2.5" />
          <path d="M3.5 10h17M8 3v4M16 3v4" strokeLinecap="round" />
        </svg>
      </div>
      <p className="font-display text-lg text-ink-900">{titulo}</p>
      {descricao && <p className="max-w-sm text-sm text-ink-700/70">{descricao}</p>}
      {acao}
    </div>
  );
}
