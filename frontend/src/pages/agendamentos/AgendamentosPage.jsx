import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { agendamentosApi } from "../../api/agendamentos";
import { usePaginatedList } from "../../hooks/usePaginatedList";
import { useUsuariosOptions } from "../../hooks/useUsuariosOptions";
import { useToast } from "../../context/ToastContext";
import PageHeader from "../../components/ui/PageHeader";
import Table from "../../components/ui/Table";
import Pagination from "../../components/ui/Pagination";
import Pill from "../../components/ui/Pill";
import { SelectField } from "../../components/ui/fields";
import { STATUS_AGENDAMENTO, CORES_STATUS_AGENDAMENTO, rotularEnum } from "../../utils/domain";
import { formatarData, formatarHora } from "../../utils/format";
import NovoAgendamentoModal from "./NovoAgendamentoModal";
import AgendamentoDetailModal from "./AgendamentoDetailModal";

export default function AgendamentosPage() {
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const { usuarios } = useUsuariosOptions();

  const buscar = useCallback((params) => {
    const { usuarioId, ...resto } = params;
    return usuarioId ? agendamentosApi.listarPorUsuario(usuarioId, resto) : agendamentosApi.listarTodos(resto);
  }, []);
  const { pagina, linhas, carregando, filtros, aplicarFiltros, setPaginaAtual, recarregar } = usePaginatedList(buscar, {
    ordenarPor: "dataReuniao,desc",
  });

  const [modalNovoAberto, setModalNovoAberto] = useState(searchParams.get("novo") === "1");
  const [detalhe, setDetalhe] = useState(null);

  function abrirNovo() {
    setModalNovoAberto(true);
  }
  function fecharNovo() {
    setModalNovoAberto(false);
    if (searchParams.get("novo")) {
      searchParams.delete("novo");
      setSearchParams(searchParams, { replace: true });
    }
  }
  function aoCriar() {
    toast.sucesso("Agendamento criado com sucesso!");
    fecharNovo();
    recarregar();
  }

  async function abrirDetalhe(linha) {
    try {
      setDetalhe(await agendamentosApi.buscarPorId(linha.id));
    } catch (e) {
      toast.erro(e.message);
    }
  }
  async function recarregarDetalhe() {
    if (!detalhe) return;
    try {
      setDetalhe(await agendamentosApi.buscarPorId(detalhe.id));
    } catch {
      /* silencioso: o modal principal já mostra erros via toast */
    }
    recarregar();
  }

  return (
    <div>
      <PageHeader
        titulo="Agendamentos"
        subtitulo="Solicitações e reuniões marcadas entre alunos, professores e coordenadores."
        acao={
          <button className="btn-accent" onClick={abrirNovo}>
            + Novo agendamento
          </button>
        }
      />

      <div className="card mb-4 flex flex-wrap items-end gap-3 p-4">
        <SelectField
          label="Usuário envolvido"
          className="w-64"
          placeholder="Todos os agendamentos"
          options={usuarios.map((u) => ({ valor: u.id, rotulo: u.nome }))}
          value={filtros.usuarioId || ""}
          onChange={(e) => aplicarFiltros({ ...filtros, usuarioId: e.target.value })}
        />
        <SelectField
          label="Status"
          className="w-52"
          placeholder="Todos os status"
          options={STATUS_AGENDAMENTO.map((s) => ({ valor: s, rotulo: rotularEnum(s) }))}
          value={filtros.status || ""}
          onChange={(e) => aplicarFiltros({ ...filtros, status: e.target.value })}
        />
        <label className="block">
          <span className="field-label">De</span>
          <input
            type="date"
            className="field-input"
            value={filtros.dataInicio || ""}
            onChange={(e) => aplicarFiltros({ ...filtros, dataInicio: e.target.value })}
          />
        </label>
        <label className="block">
          <span className="field-label">Até</span>
          <input
            type="date"
            className="field-input"
            value={filtros.dataFim || ""}
            onChange={(e) => aplicarFiltros({ ...filtros, dataFim: e.target.value })}
          />
        </label>
      </div>

      <Table
        carregando={carregando}
        chaveLinha={(a) => a.id}
        linhas={linhas}
        colunas={[
          { chave: "topico", titulo: "Tópico", render: (a) => (
              <div>
                <p className="font-medium">{a.topico}</p>
                <p className="text-xs text-ink-700/60">{a.nomeOrganizador}</p>
              </div>
            ) },
          { chave: "data", titulo: "Data / hora", render: (a) => `${formatarData(a.dataReuniao)} · ${formatarHora(a.horarioInicio)}` },
          { chave: "formato", titulo: "Formato", render: (a) => rotularEnum(a.formato) },
          { chave: "status", titulo: "Status", render: (a) => (
              <Pill className={CORES_STATUS_AGENDAMENTO[a.status]}>{rotularEnum(a.status)}</Pill>
            ) },
        ]}
        acoes={(a) => (
          <button className="btn-ghost !px-2.5 !py-1 text-xs" onClick={() => abrirDetalhe(a)}>
            Ver detalhes
          </button>
        )}
      />
      <Pagination pagina={pagina} onMudarPagina={setPaginaAtual} />

      <NovoAgendamentoModal
        aberto={modalNovoAberto}
        onFechar={fecharNovo}
        onCriado={aoCriar}
        criarAgendamento={agendamentosApi.criar}
      />

      <AgendamentoDetailModal agendamento={detalhe} onFechar={() => setDetalhe(null)} onAlterado={recarregarDetalhe} />
    </div>
  );
}
