import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { agendamentosApi } from "../api/agendamentos";
import { usuariosApi } from "../api/usuarios";
import { useAuth } from "../context/AuthContext";
import PageHeader from "../components/ui/PageHeader";
import Spinner from "../components/ui/Spinner";
import { CORES_STATUS_AGENDAMENTO, rotularEnum } from "../utils/domain";
import { formatarData, formatarHora } from "../utils/format";
import Pill from "../components/ui/Pill";

const STATUS_RESUMO = ["PENDENTE", "AGUARDANDO_RESPOSTA", "CONFIRMADO", "CONCLUIDO", "CANCELADO"];

export default function DashboardPage() {
  const { perfilVinculado, pode } = useAuth();
  const [contagens, setContagens] = useState(null);
  const [totalUsuarios, setTotalUsuarios] = useState(null);
  const [proximos, setProximos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let cancelado = false;
    async function carregar() {
      setCarregando(true);
      try {
        const [porStatus, usuariosPagina, agendamentosPagina] = await Promise.all([
          Promise.all(
            STATUS_RESUMO.map((status) =>
              agendamentosApi.listarTodos({ status, page: 0, size: 1 }).then((p) => [status, p.totalElementos])
            )
          ),
          usuariosApi.listar({ page: 0, size: 1 }),
          agendamentosApi.listarTodos({ page: 0, size: 6, sort: "dataReuniao,asc" }),
        ]);
        if (cancelado) return;
        setContagens(Object.fromEntries(porStatus));
        setTotalUsuarios(usuariosPagina.totalElementos);
        setProximos(agendamentosPagina.conteudo);
      } catch {
        // painel é apenas informativo — erros de rede já aparecem em outras telas
      } finally {
        if (!cancelado) setCarregando(false);
      }
    }
    carregar();
    return () => {
      cancelado = true;
    };
  }, []);

  return (
    <div>
      <PageHeader
        titulo={`Olá${perfilVinculado?.nome ? ", " + perfilVinculado.nome.split(" ")[0] : ""}!`}
        subtitulo="Visão geral dos agendamentos e cadastros do Schedemy."
      />

      {carregando ? (
        <div className="flex justify-center py-16 text-ink-700">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {STATUS_RESUMO.map((status) => (
              <div key={status} className="card p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-700/60">
                  {rotularEnum(status)}
                </p>
                <p className="mt-1 font-display text-3xl text-ink-900">{contagens?.[status] ?? "—"}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="card lg:col-span-2">
              <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
                <h2 className="font-display text-lg text-ink-900">Próximos agendamentos</h2>
                {pode("agendamentos.ver") && (
                  <Link to="/agendamentos" className="text-sm font-medium text-brand-700 hover:underline">
                    Ver todos →
                  </Link>
                )}
              </div>
              {proximos.length === 0 ? (
                <p className="px-5 py-8 text-sm text-ink-700/70">Nenhum agendamento cadastrado ainda.</p>
              ) : (
                <ul className="divide-y divide-ink-100/70">
                  {proximos.map((a) => (
                    <li key={a.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-ink-900">{a.topico}</p>
                        <p className="text-xs text-ink-700/60">
                          {formatarData(a.dataReuniao)} às {formatarHora(a.horarioInicio)} · {a.nomeOrganizador}
                        </p>
                      </div>
                      <Pill className={CORES_STATUS_AGENDAMENTO[a.status]}>{rotularEnum(a.status)}</Pill>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="card p-5">
              <h2 className="font-display text-lg text-ink-900">Ações rápidas</h2>
              {pode("usuarios.gerenciar") && (
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-ink-700/70">Usuários cadastrados</span>
                    <span className="font-semibold text-ink-900">{totalUsuarios ?? "—"}</span>
                  </div>
                </div>
              )}
              <div className="mt-5 grid grid-cols-2 gap-2">
                {pode("agendamentos.criar") && (
                  <Link to="/agendamentos?novo=1" className="btn-accent justify-center">
                    + Agendamento
                  </Link>
                )}
                {pode("usuarios.gerenciar") && (
                  <Link to="/usuarios" className="btn-ghost justify-center border border-ink-100">
                    + Usuário
                  </Link>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
