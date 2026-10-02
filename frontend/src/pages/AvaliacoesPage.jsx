import { useCallback, useState } from "react";
import { avaliacoesApi } from "../api/avaliacoes";
import { usePaginatedList } from "../hooks/usePaginatedList";
import { useUsuariosOptions } from "../hooks/useUsuariosOptions";
import { useToast } from "../context/ToastContext";
import PageHeader from "../components/ui/PageHeader";
import Table from "../components/ui/Table";
import Pagination from "../components/ui/Pagination";
import Modal from "../components/ui/Modal";
import EmptyState from "../components/ui/EmptyState";
import { SelectField, TextField, TextAreaField } from "../components/ui/fields";
import { formatarDataHora } from "../utils/format";

export default function AvaliacoesPage() {
  const toast = useToast();
  const { usuarios } = useUsuariosOptions("ALUNO");
  const [alunoId, setAlunoId] = useState("");

  const buscar = useCallback(
    (params) => (alunoId ? avaliacoesApi.listarPorAluno(alunoId, params) : Promise.resolve({ conteudo: [], totalPaginas: 0 })),
    [alunoId]
  );
  const { pagina, linhas, carregando, setPaginaAtual, recarregar } = usePaginatedList(buscar, { ordenarPor: "criadoEm,desc" });

  const [modalAberto, setModalAberto] = useState(false);
  const [form, setForm] = useState({ idAgendamento: "", nota: 5, comentario: "" });
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  function abrirCriacao() {
    if (!alunoId) return toast.info("Selecione um aluno para avaliar uma reunião.");
    setForm({ idAgendamento: "", nota: 5, comentario: "" });
    setErro("");
    setModalAberto(true);
  }

  async function salvar(e) {
    e.preventDefault();
    if (!form.idAgendamento) return setErro("Informe o ID do agendamento concluído.");
    setSalvando(true);
    try {
      await avaliacoesApi.criar({
        idAgendamento: Number(form.idAgendamento),
        idAluno: Number(alunoId),
        nota: Number(form.nota),
        comentario: form.comentario || null,
      });
      toast.sucesso("Avaliação registrada. Obrigado pelo retorno!");
      setModalAberto(false);
      recarregar();
    } catch (e2) {
      setErro(e2.message);
      toast.erro(e2.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div>
      <PageHeader
        titulo="Avaliações"
        subtitulo="Avaliações registradas pelos alunos após reuniões concluídas."
        acao={
          <button className="btn-accent" onClick={abrirCriacao}>
            + Nova avaliação
          </button>
        }
      />

      <div className="card mb-4 flex flex-wrap items-end gap-3 p-4">
        <SelectField
          label="Aluno"
          className="w-72"
          placeholder="Selecione um aluno…"
          options={usuarios.map((u) => ({ valor: u.id, rotulo: u.nome }))}
          value={alunoId}
          onChange={(e) => {
            setAlunoId(e.target.value);
            setPaginaAtual(0);
          }}
        />
      </div>

      {!alunoId ? (
        <EmptyState titulo="Selecione um aluno" descricao="Escolha um aluno acima para ver as avaliações registradas por ele." />
      ) : (
        <>
          <Table
            carregando={carregando}
            chaveLinha={(a) => a.id}
            linhas={linhas}
            colunas={[
              { chave: "agendamento", titulo: "Agendamento", render: (a) => `#${a.idAgendamento}` },
              { chave: "nota", titulo: "Nota", render: (a) => "⭐".repeat(a.nota) || "0" },
              { chave: "comentario", titulo: "Comentário", render: (a) => a.comentario || "—" },
              { chave: "data", titulo: "Registrada em", render: (a) => formatarDataHora(a.criadoEm) },
            ]}
          />
          <Pagination pagina={pagina} onMudarPagina={setPaginaAtual} />
        </>
      )}

      <Modal aberto={modalAberto} onFechar={() => setModalAberto(false)} titulo="Nova avaliação" largura="max-w-md">
        <form onSubmit={salvar} className="space-y-4">
          <TextField
            label="ID do agendamento (concluído)"
            type="number"
            required
            value={form.idAgendamento}
            onChange={(e) => setForm({ ...form, idAgendamento: e.target.value })}
          />
          <SelectField
            label="Nota"
            options={[0, 1, 2, 3, 4, 5].map((n) => ({ valor: n, rotulo: `${n} estrela${n === 1 ? "" : "s"}` }))}
            value={form.nota}
            onChange={(e) => setForm({ ...form, nota: e.target.value })}
          />
          <TextAreaField
            label="Comentário (opcional)"
            value={form.comentario}
            onChange={(e) => setForm({ ...form, comentario: e.target.value })}
            placeholder="Conte como foi o atendimento"
          />
          {erro && <p className="field-error">{erro}</p>}
          <div className="flex justify-end gap-2 border-t border-ink-100 pt-4">
            <button type="button" className="btn-ghost" onClick={() => setModalAberto(false)}>
              Cancelar
            </button>
            <button type="submit" className="btn-accent" disabled={salvando}>
              {salvando ? "Enviando…" : "Registrar avaliação"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
