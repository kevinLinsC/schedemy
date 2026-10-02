export default function PageHeader({ titulo, subtitulo, acao }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-[28px] leading-tight text-ink-900">{titulo}</h1>
        {subtitulo && <p className="mt-1 max-w-2xl text-sm text-ink-700/70">{subtitulo}</p>}
      </div>
      {acao}
    </div>
  );
}
