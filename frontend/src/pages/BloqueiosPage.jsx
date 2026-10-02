import { useCallback, useState } from "react";
import { bloqueiosApi } from "../api/bloqueios";
import { usePaginatedList } from "../hooks/usePaginatedList";
import { useUsuariosOptions } from "../hooks/useUsuariosOptions";
import { useToast } from "../context/ToastContext";
import PageHeader from "../components/ui/PageHeader";
import Table from "../components/ui/Table";
import Pagination from "../components/ui/Pagination";
import Modal from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import Pill from "../components/ui/Pill";
import EmptyState from "../components/ui/EmptyState";
import { TextField, SelectField, FieldGrid, CheckboxField } from "../components/ui/fields";
import { DIAS_SEMANA, CORES_STATUS_AGENDAMENTO, rotularEnum } from "../utils/domain";
import { formatarData, hojeISO } from "../utils/format";

const FORM_VAZIO = {
  idUsuario: "",
  dataInicio: hojeISO(),
  dataFim: hojeISO(),
  horarioInicio: "",
  horarioFim: "",
  eRecorrente: false,
  diaSemanaRecorrente: "2",
  motivo: "",
};

export default function BloqueiosPage() {
  const toast = useToast();
  const { usuarios: professores } = useUsuariosOptions();
  const docentes = professores.filter((u) => u.tipoUsuario === "PROFESSOR" || u.tipoUsuario === "COORDENADOR");

  const buscar = useCallback((params) => bloqueiosApi.listar(params), []);
  const { pagina, linhas, carregando, filtros, aplicarFiltros, setPaginaAtual, recarregar } = usePaginatedList(buscar);

  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState(FORM_VAZIO);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [paraRemover, setParaRemover] = useState(null);
  const [removendo, setRemovendo] = useState(false);

  const [modalImpactados, setModalImpactados] = useState(null);
  const [impactados, setImpactados] = useState([]);
  const [carregandoImpactados, setCarregandoImpactados] = useState(false);

  function abrirCriacao() {
    setEditando(null);
    setForm(FORM_VAZIO);
    setErro("");
    setModalAberto(true);
  }

  function abrirEdicao(b) {
    setEditando(b);
    setForm({
      idUsuario: String(b.idUsuario),
      dataInicio: b.dataInicio,
      dataFim: b.dataFim,
      horarioInicio: b.horarioInicio ? b.horarioInicio.slice(0, 5) : "",
      horarioFim: b.horarioFim ? b.horarioFim.slice(0, 5) : "",
      eRecorrente: b.eRecorrente,
      diaSemanaRecorrente: String(b.diaSemanaRecorrente || 2),
      motivo: b.motivo || "",
    });
    setErro("");
    setModalAberto(true);
  }

  async function salvar(e) {
    e.preventDefault();
    if (!form.idUsuario) {
      setErro("Selecione um professor ou coordenador.");
      return;
    }
    setSalvando(true);
    try {
      const payload = {
        idUsuario: Number(form.idUsuario),
        dataInicio: form.dataInicio,
        dataFim: form.dataFim,
        horarioInicio: form.horarioInicio ? `${form.horarioInicio}:00` : null,
        horarioFim: form.horarioFim ? `${form.horarioFim}:00` : null,
        eRecorrente: form.eRecorrente,
        diaSemanaRecorrente: form.eRecorrente ? Number(form.diaSemanaRecorrente) : null,
        motivo: form.motivo || null,
      };
      if (editando) {
        await bloqueiosApi.atualizar(editando.id, payload);
        toast.sucesso("Bloqueio atualizado.");
      } else {
        await bloqueiosApi.criar(payload);
        toast.sucesso("Bloqueio cadastrado.");
      }
      setModalAberto(false);
      recarregar();
    } catch (e2) {
      setErro(e2.message);
      toast.erro(e2.message);
    } finally {
      setSalvando(false);
    }
  }

  async function confirmarRemocao() {
    setRemovendo(true);
    try {
      await bloqueiosApi.remover(paraRemover.id);
      toast.sucesso("Bloqueio removido.");
      setParaRemover(null);
      recarregar();
    } catch (e) {
      toast.erro(e.message);
    } finally {
      setRemovendo(false);
    }
  }

  async function abrirImpactados(bloqueio) {
    setModalImpactados(bloqueio);
    setCarregandoImpactados(true);
    try {
      setImpactados(await bloqueiosApi.listarImpactados(bloqueio.id));
    } catch (e) {
      toast.erro(e.message);
    } finally {
      setCarregandoImpactados(false);
    }
  }

  return (
    <div>
      <PageHeader
        titulo="Bloqueios de período"
        subtitulo="Períodos de indisponibilidade na agenda de professores e coordenadores."
        acao={
          <button className="btn-accent" onClick={abrirCriacao}>
            + Novo bloqueio
          </button>
        }
      />

      <div className="card mb-4 flex flex-wrap items-end gap-3 p-4">
        <SelectField
          label="Professor / coordenador"
          className="w-full sm:w-64"
          placeholder="Todos"
          options={docentes.map((u) => ({ valor: u.id, rotulo: u.nome }))}
          value={filtros.usuarioId || ""}
          onChange={(e) => aplicarFiltros({ ...filtros, usuarioId: e.target.value })}
        />
      </div>

      <Table
        carregando={carregando}
        chaveLinha={(b) => b.id}
        linhas={linhas}
        colunas={[
          { chave: "usuario", titulo: "Professor / coordenador", render: (b) => b.nomeUsuario },
          { chave: "periodo", titulo: "Período", render: (b) =>
              b.dataInicio === b.dataFim ? formatarData(b.dataInicio) : `${formatarData(b.dataInicio)} – ${formatarData(b.dataFim)}` },
          { chave: "horario", titulo: "Horário", render: (b) =>
              b.horarioInicio ? `${b.horarioInicio.slice(0, 5)} – ${b.horarioFim.slice(0, 5)}` : "Dia inteiro" },
          { chave: "recorrente", titulo: "Recorrente", render: (b) => (b.eRecorrente ? "Sim" : "Não") },
          { chave: "motivo", titulo: "Motivo", render: (b) => b.motivo || "—" },
        ]}
        acoes={(b) => (
          <div className="flex justify-end gap-1">
            <button className="btn-ghost !px-2.5 !py-1 text-xs" onClick={() => abrirImpactados(b)}>
              Impactados
            </button>
            <button className="btn-ghost !px-2.5 !py-1 text-xs" onClick={() => abrirEdicao(b)}>
              Editar
            </button>
            <button className="btn-danger !px-2.5 !py-1 text-xs" onClick={() => setParaRemover(b)}>
              Remover
            </button>
          </div>
        )}
      />
      <Pagination pagina={pagina} onMudarPagina={setPaginaAtual} />

      <Modal
        aberto={modalAberto}
        onFechar={() => setModalAberto(false)}
        titulo={editando ? "Editar bloqueio" : "Novo bloqueio"}
      >
        <form onSubmit={salvar} className="space-y-4">
          <SelectField
            label="Professor / coordenador"
            required
            placeholder="Selecione…"
            options={docentes.map((u) => ({ valor: u.id, rotulo: `${u.nome} (${u.tipoUsuario})` }))}
            value={form.idUsuario}
            onChange={(e) => setForm({ ...form, idUsuario: e.target.value })}
          />
          <FieldGrid>
            <label className="block">
              <span className="field-label">Data de início</span>
              <input
                type="date"
                className="field-input"
                value={form.dataInicio}
                onChange={(e) => setForm({ ...form, dataInicio: e.target.value })}
                required
              />
            </label>
            <label className="block">
              <span className="field-label">Data de fim</span>
              <input
                type="date"
                className="field-input"
                value={form.dataFim}
                onChange={(e) => setForm({ ...form, dataFim: e.target.value })}
                required
              />
            </label>
          </FieldGrid>
          <FieldGrid>
            <label className="block">
              <span className="field-label">Horário de início (opcional)</span>
              <input
                type="time"
                className="field-input"
                value={form.horarioInicio}
                onChange={(e) => setForm({ ...form, horarioInicio: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="field-label">Horário de fim (opcional)</span>
              <input
                type="time"
                className="field-input"
                value={form.horarioFim}
                onChange={(e) => setForm({ ...form, horarioFim: e.target.value })}
              />
            </label>
          </FieldGrid>
          <p className="text-xs text-ink-700/60">Deixe os horários em branco para bloquear o dia inteiro.</p>

          <CheckboxField
            label="Bloqueio recorrente (repete semanalmente)"
            checked={form.eRecorrente}
            onChange={(e) => setForm({ ...form, eRecorrente: e.target.checked })}
          />
          {form.eRecorrente && (
            <SelectField
              label="Dia da semana recorrente"
              required
              options={DIAS_SEMANA.map((d) => ({ valor: d.valor, rotulo: d.rotulo }))}
              value={form.diaSemanaRecorrente}
              onChange={(e) => setForm({ ...form, diaSemanaRecorrente: e.target.value })}
            />
          )}

          <TextField
            label="Motivo"
            placeholder="Ex.: Congresso acadêmico"
            value={form.motivo}
            onChange={(e) => setForm({ ...form, motivo: e.target.value })}
          />

          {erro && <p className="field-error">{erro}</p>}

          <div className="flex justify-end gap-2 border-t border-ink-100 pt-4">
            <button type="button" className="btn-ghost" onClick={() => setModalAberto(false)}>
              Cancelar
            </button>
            <button type="submit" className="btn-accent" disabled={salvando}>
              {salvando ? "Salvando…" : "Salvar"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        aberto={!!modalImpactados}
        onFechar={() => setModalImpactados(null)}
        titulo="Agendamentos impactados"
        subtitulo={modalImpactados ? `Bloqueio de ${modalImpactados.nomeUsuario}` : ""}
      >
        {carregandoImpactados ? (
          <p className="py-6 text-center text-sm text-ink-700">Carregando…</p>
        ) : impactados.length === 0 ? (
          <EmptyState titulo="Nenhum agendamento impactado" descricao="Este bloqueio não colide com reuniões já marcadas." />
        ) : (
          <ul className="divide-y divide-ink-100">
            {impactados.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="text-sm font-medium text-ink-900">{a.topico}</p>
                  <p className="text-xs text-ink-700/60">
                    {formatarData(a.dataReuniao)} às {a.horarioInicio?.slice(0, 5)}
                  </p>
                </div>
                <Pill className={CORES_STATUS_AGENDAMENTO[a.status]}>{rotularEnum(a.status)}</Pill>
              </li>
            ))}
          </ul>
        )}
      </Modal>

      <ConfirmDialog
        aberto={!!paraRemover}
        titulo="Remover bloqueio"
        descricao="Tem certeza que deseja remover este bloqueio de período?"
        confirmarRotulo="Remover"
        tom="danger"
        carregando={removendo}
        onConfirmar={confirmarRemocao}
        onCancelar={() => setParaRemover(null)}
      />
    </div>
  );
}
