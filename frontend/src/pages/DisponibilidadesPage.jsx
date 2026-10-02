import { useCallback, useState } from "react";
import { disponibilidadesApi } from "../api/disponibilidades";
import { usePaginatedList } from "../hooks/usePaginatedList";
import { useUsuariosOptions } from "../hooks/useUsuariosOptions";
import { useToast } from "../context/ToastContext";
import PageHeader from "../components/ui/PageHeader";
import Table from "../components/ui/Table";
import Pagination from "../components/ui/Pagination";
import Modal from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import Pill from "../components/ui/Pill";
import { SelectField, FieldGrid, CheckboxField } from "../components/ui/fields";
import { DIAS_SEMANA, rotularDiaSemana } from "../utils/domain";

const FORM_VAZIO = { idUsuario: "", diaSemana: "2", horarioInicio: "08:00", horarioFim: "12:00", ativo: true };

export default function DisponibilidadesPage() {
  const toast = useToast();
  const { usuarios: professores } = useUsuariosOptions();
  const buscar = useCallback((params) => disponibilidadesApi.listar(params), []);
  const { pagina, linhas, carregando, filtros, aplicarFiltros, setPaginaAtual, recarregar } = usePaginatedList(buscar);

  const docentes = professores.filter((u) => u.tipoUsuario === "PROFESSOR" || u.tipoUsuario === "COORDENADOR");

  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState(FORM_VAZIO);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [paraRemover, setParaRemover] = useState(null);
  const [removendo, setRemovendo] = useState(false);

  function abrirCriacao() {
    setEditando(null);
    setForm(FORM_VAZIO);
    setErro("");
    setModalAberto(true);
  }

  function abrirEdicao(d) {
    setEditando(d);
    setForm({
      idUsuario: String(d.idUsuario),
      diaSemana: String(d.diaSemana),
      horarioInicio: d.horarioInicio.slice(0, 5),
      horarioFim: d.horarioFim.slice(0, 5),
      ativo: d.ativo,
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
    if (form.horarioFim <= form.horarioInicio) {
      setErro("O horário de fim deve ser posterior ao horário de início.");
      return;
    }
    setSalvando(true);
    try {
      const payload = {
        idUsuario: Number(form.idUsuario),
        diaSemana: Number(form.diaSemana),
        horarioInicio: `${form.horarioInicio}:00`,
        horarioFim: `${form.horarioFim}:00`,
        ativo: form.ativo,
      };
      if (editando) {
        await disponibilidadesApi.atualizar(editando.id, payload);
        toast.sucesso("Disponibilidade atualizada.");
      } else {
        await disponibilidadesApi.criar(payload);
        toast.sucesso("Disponibilidade cadastrada.");
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
      await disponibilidadesApi.remover(paraRemover.id);
      toast.sucesso("Disponibilidade removida.");
      setParaRemover(null);
      recarregar();
    } catch (e) {
      toast.erro(e.message);
    } finally {
      setRemovendo(false);
    }
  }

  return (
    <div>
      <PageHeader
        titulo="Disponibilidades"
        subtitulo="Grade semanal de horários de atendimento de professores e coordenadores."
        acao={
          <button className="btn-accent" onClick={abrirCriacao}>
            + Nova disponibilidade
          </button>
        }
      />

      <div className="card mb-4 flex flex-wrap items-end gap-3 p-4">
        <SelectField
          label="Professor / coordenador"
          className="w-64"
          placeholder="Todos"
          options={docentes.map((u) => ({ valor: u.id, rotulo: u.nome }))}
          value={filtros.usuarioId || ""}
          onChange={(e) => aplicarFiltros({ ...filtros, usuarioId: e.target.value })}
        />
        <SelectField
          label="Dia da semana"
          className="w-48"
          placeholder="Todos"
          options={DIAS_SEMANA.map((d) => ({ valor: d.valor, rotulo: d.rotulo }))}
          value={filtros.diaSemana || ""}
          onChange={(e) => aplicarFiltros({ ...filtros, diaSemana: e.target.value })}
        />
      </div>

      <Table
        carregando={carregando}
        chaveLinha={(d) => d.id}
        linhas={linhas}
        colunas={[
          { chave: "usuario", titulo: "Professor / coordenador", render: (d) => d.nomeUsuario },
          { chave: "dia", titulo: "Dia da semana", render: (d) => rotularDiaSemana(d.diaSemana) },
          { chave: "horario", titulo: "Horário", render: (d) => `${d.horarioInicio.slice(0, 5)} – ${d.horarioFim.slice(0, 5)}` },
          { chave: "ativo", titulo: "Status", render: (d) => (
              <Pill className={d.ativo ? "bg-sage-100 text-sage-700" : "bg-brick-100 text-brick-700"}>
                {d.ativo ? "Ativa" : "Inativa"}
              </Pill>
            ) },
        ]}
        acoes={(d) => (
          <div className="flex justify-end gap-1">
            <button className="btn-ghost !px-2.5 !py-1 text-xs" onClick={() => abrirEdicao(d)}>
              Editar
            </button>
            <button className="btn-danger !px-2.5 !py-1 text-xs" onClick={() => setParaRemover(d)}>
              Remover
            </button>
          </div>
        )}
      />
      <Pagination pagina={pagina} onMudarPagina={setPaginaAtual} />

      <Modal
        aberto={modalAberto}
        onFechar={() => setModalAberto(false)}
        titulo={editando ? "Editar disponibilidade" : "Nova disponibilidade"}
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
          <SelectField
            label="Dia da semana"
            required
            options={DIAS_SEMANA.map((d) => ({ valor: d.valor, rotulo: d.rotulo }))}
            value={form.diaSemana}
            onChange={(e) => setForm({ ...form, diaSemana: e.target.value })}
          />
          <FieldGrid>
            <label className="block">
              <span className="field-label">Horário de início</span>
              <input
                type="time"
                className="field-input"
                value={form.horarioInicio}
                onChange={(e) => setForm({ ...form, horarioInicio: e.target.value })}
                required
              />
            </label>
            <label className="block">
              <span className="field-label">Horário de fim</span>
              <input
                type="time"
                className="field-input"
                value={form.horarioFim}
                onChange={(e) => setForm({ ...form, horarioFim: e.target.value })}
                required
              />
            </label>
          </FieldGrid>
          {erro && <p className="field-error">{erro}</p>}
          <CheckboxField
            label="Disponibilidade ativa"
            checked={form.ativo}
            onChange={(e) => setForm({ ...form, ativo: e.target.checked })}
          />
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

      <ConfirmDialog
        aberto={!!paraRemover}
        titulo="Remover disponibilidade"
        descricao="Tem certeza que deseja remover esta disponibilidade?"
        confirmarRotulo="Remover"
        tom="danger"
        carregando={removendo}
        onConfirmar={confirmarRemocao}
        onCancelar={() => setParaRemover(null)}
      />
    </div>
  );
}
