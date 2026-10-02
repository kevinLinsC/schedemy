import { useEffect, useState } from "react";
import { duracoesApi } from "../api/duracoes";
import { useToast } from "../context/ToastContext";
import PageHeader from "../components/ui/PageHeader";
import Table from "../components/ui/Table";
import Modal from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import Pill from "../components/ui/Pill";
import { TextField, CheckboxField } from "../components/ui/fields";

export default function DuracoesPage() {
  const toast = useToast();
  const [lista, setLista] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [minutos, setMinutos] = useState(30);
  const [ativo, setAtivo] = useState(true);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [paraRemover, setParaRemover] = useState(null);
  const [removendo, setRemovendo] = useState(false);

  async function carregar() {
    setCarregando(true);
    try {
      setLista(await duracoesApi.listar(false));
    } catch (e) {
      toast.erro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function abrirCriacao() {
    setEditando(null);
    setMinutos(30);
    setAtivo(true);
    setErro("");
    setModalAberto(true);
  }

  function abrirEdicao(d) {
    setEditando(d);
    setMinutos(d.minutos);
    setAtivo(d.ativo);
    setErro("");
    setModalAberto(true);
  }

  async function salvar(e) {
    e.preventDefault();
    if (!minutos || minutos < 1) {
      setErro("Informe uma duração válida em minutos.");
      return;
    }
    setSalvando(true);
    try {
      const payload = { minutos: Number(minutos), ativo };
      if (editando) {
        await duracoesApi.atualizar(editando.id, payload);
        toast.sucesso("Duração atualizada.");
      } else {
        await duracoesApi.criar(payload);
        toast.sucesso("Duração cadastrada.");
      }
      setModalAberto(false);
      carregar();
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
      await duracoesApi.remover(paraRemover.id);
      toast.sucesso("Duração removida.");
      setParaRemover(null);
      carregar();
    } catch (e) {
      toast.erro(e.message);
    } finally {
      setRemovendo(false);
    }
  }

  return (
    <div>
      <PageHeader
        titulo="Durações de reunião"
        subtitulo="Opções de duração disponíveis ao criar um agendamento (10 a 60 minutos)."
        acao={
          <button className="btn-accent" onClick={abrirCriacao}>
            + Nova duração
          </button>
        }
      />

      <Table
        carregando={carregando}
        chaveLinha={(d) => d.id}
        linhas={lista}
        colunas={[
          { chave: "minutos", titulo: "Duração", render: (d) => <span className="font-medium">{d.minutos} minutos</span> },
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

      <Modal
        aberto={modalAberto}
        onFechar={() => setModalAberto(false)}
        titulo={editando ? "Editar duração" : "Nova duração"}
        largura="max-w-sm"
      >
        <form onSubmit={salvar} className="space-y-4">
          <TextField
            label="Minutos"
            type="number"
            min={1}
            max={480}
            required
            value={minutos}
            onChange={(e) => setMinutos(e.target.value)}
            error={erro}
          />
          <CheckboxField label="Duração ativa" checked={ativo} onChange={(e) => setAtivo(e.target.checked)} />
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
        titulo="Remover duração"
        descricao={`Remover a duração de ${paraRemover?.minutos} minutos? Agendamentos já criados não serão afetados.`}
        confirmarRotulo="Remover"
        tom="danger"
        carregando={removendo}
        onConfirmar={confirmarRemocao}
        onCancelar={() => setParaRemover(null)}
      />
    </div>
  );
}
