import Spinner from "./Spinner";
import EmptyState from "./EmptyState";

export default function Table({ colunas, linhas, carregando, chaveLinha, linhaVazia, acoes }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-ink-100 bg-white shadow-soft">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-ink-100 bg-ink-50">
            {colunas.map((coluna) => (
              <th
                key={coluna.chave}
                className="whitespace-nowrap px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-ink-700"
              >
                {coluna.titulo}
              </th>
            ))}
            {acoes && (
              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-ink-700">
                Ações
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {carregando ? (
            <tr>
              <td colSpan={colunas.length + (acoes ? 1 : 0)} className="px-4 py-14 text-center text-ink-700">
                <Spinner className="mx-auto" />
              </td>
            </tr>
          ) : linhas.length === 0 ? (
            <tr>
              <td colSpan={colunas.length + (acoes ? 1 : 0)}>
                {linhaVazia || <EmptyState titulo="Nenhum registro encontrado" />}
              </td>
            </tr>
          ) : (
            linhas.map((linha) => (
              <tr key={chaveLinha(linha)} className="border-b border-ink-100/70 last:border-0 hover:bg-parchment/70">
                {colunas.map((coluna) => (
                  <td key={coluna.chave} className="px-4 py-3 align-top text-ink-900">
                    {coluna.render ? coluna.render(linha) : linha[coluna.chave]}
                  </td>
                ))}
                {acoes && <td className="px-4 py-3 text-right align-top">{acoes(linha)}</td>}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
