import { useCallback } from "react";
import { notificacoesApi } from "../api/notificacoes";
import { usePaginatedList } from "../hooks/usePaginatedList";
import { useUsuariosOptions } from "../hooks/useUsuariosOptions";
import { useToast } from "../context/ToastContext";
import PageHeader from "../components/ui/PageHeader";
import Table from "../components/ui/Table";
import Pagination from "../components/ui/Pagination";
import Pill from "../components/ui/Pill";
import { SelectField } from "../components/ui/fields";
import { STATUS_ENVIO, CORES_STATUS_ENVIO, rotularEnum } from "../utils/domain";
import { formatarDataHora } from "../utils/format";

export default function NotificacoesPage() {
  const toast = useToast();
  const { usuarios } = useUsuariosOptions();
  const buscar = useCallback((params) => notificacoesApi.listar(params), []);
  const { pagina, linhas, carregando, filtros, aplicarFiltros, setPaginaAtual, recarregar } = usePaginatedList(buscar, {
    ordenarPor: "criadoEm,desc",
  });

  async function marcarComoEnviada(n) {
    try {
      await notificacoesApi.marcarComoEnviada(n.id);
      toast.sucesso("Notificação marcada como enviada.");
      recarregar();
    } catch (e) {
      toast.erro(e.message);
    }
  }

  return (
    <div>
      <PageHeader
        titulo="Notificações"
        subtitulo="Fila e histórico de notificações enviadas aos envolvidos nas reuniões."
      />

      <div className="card mb-4 flex flex-wrap items-end gap-3 p-4">
        <SelectField
          label="Usuário"
          className="w-64"
          placeholder="Todos"
          options={usuarios.map((u) => ({ valor: u.id, rotulo: u.nome }))}
          value={filtros.usuarioId || ""}
          onChange={(e) => aplicarFiltros({ ...filtros, usuarioId: e.target.value })}
        />
        <SelectField
          label="Status de envio"
          className="w-48"
          placeholder="Todos"
          options={STATUS_ENVIO.map((s) => ({ valor: s, rotulo: rotularEnum(s) }))}
          value={filtros.status || ""}
          onChange={(e) => aplicarFiltros({ ...filtros, status: e.target.value })}
        />
      </div>

      <Table
        carregando={carregando}
        chaveLinha={(n) => n.id}
        linhas={linhas}
        colunas={[
          { chave: "mensagem", titulo: "Mensagem", render: (n) => (
              <div>
                <p className="font-medium">{n.mensagem}</p>
                <p className="text-xs text-ink-700/60">
                  {rotularEnum(n.tipoEvento)} · {rotularEnum(n.canalEnvio)} · agendamento #{n.idAgendamento}
                </p>
              </div>
            ) },
          { chave: "status", titulo: "Status", render: (n) => (
              <Pill className={CORES_STATUS_ENVIO[n.statusEnvio]}>{rotularEnum(n.statusEnvio)}</Pill>
            ) },
          { chave: "criadoEm", titulo: "Criada em", render: (n) => formatarDataHora(n.criadoEm) },
        ]}
        acoes={(n) =>
          n.statusEnvio === "PENDENTE" && (
            <button className="btn-ghost !px-2.5 !py-1 text-xs" onClick={() => marcarComoEnviada(n)}>
              Marcar como enviada
            </button>
          )
        }
      />
      <Pagination pagina={pagina} onMudarPagina={setPaginaAtual} />
    </div>
  );
}
