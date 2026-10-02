import { useCallback, useState } from "react";
import { usuariosApi } from "../api/usuarios";
import { usePaginatedList } from "../hooks/usePaginatedList";
import { useToast } from "../context/ToastContext";
import PageHeader from "../components/ui/PageHeader";
import Table from "../components/ui/Table";
import Pagination from "../components/ui/Pagination";
import Modal from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import Pill from "../components/ui/Pill";
import { TextField, SelectField, FieldGrid } from "../components/ui/fields";
import { TIPOS_USUARIO, CORES_TIPO_USUARIO } from "../utils/domain";

const FORM_VAZIO = {
  idMicrosoft: "",
  nome: "",
  email: "",
  telefoneWhatsapp: "",
  tipoUsuario: "ALUNO",
  matriculaRa: "",
  numIdentificacao: "",
  departamento: "",
  ativo: true,
};

export default function UsuariosPage() {
  const toast = useToast();
  const buscar = useCallback((params) => usuariosApi.listar(params), []);
  const { pagina, linhas, carregando, filtros, aplicarFiltros, setPaginaAtual, recarregar } = usePaginatedList(
    buscar,
    { ordenarPor: "nome,asc" }
  );

  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState(FORM_VAZIO);
  const [erros, setErros] = useState({});
  const [salvando, setSalvando] = useState(false);
  const [paraRemover, setParaRemover] = useState(null);
  const [removendo, setRemovendo] = useState(false);

  function abrirCriacao() {
    setEditando(null);
    setForm(FORM_VAZIO);
    setErros({});
    setModalAberto(true);
  }

  function abrirEdicao(usuario) {
    setEditando(usuario);
    setForm({
      idMicrosoft: usuario.idMicrosoft || `sso-${usuario.id}`,
      nome: usuario.nome,
      email: usuario.email,
      telefoneWhatsapp: usuario.telefoneWhatsapp || "",
      tipoUsuario: usuario.tipoUsuario,
      matriculaRa: usuario.matriculaRa || "",
      numIdentificacao: usuario.numIdentificacao || "",
      departamento: usuario.departamento || "",
      ativo: usuario.ativo,
    });
    setErros({});
    setModalAberto(true);
  }

  function validar() {
    const novosErros = {};
    if (!form.nome || form.nome.trim().length < 3) novosErros.nome = "Informe ao menos 3 caracteres.";
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email)) novosErros.email = "E-mail inválido.";
    if (!form.idMicrosoft) novosErros.idMicrosoft = "Campo obrigatório.";
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  async function salvar(e) {
    e.preventDefault();
    if (!validar()) return;
    setSalvando(true);
    try {
      const payload = { ...form, telefoneWhatsapp: form.telefoneWhatsapp || null };
      if (editando) {
        await usuariosApi.atualizar(editando.id, payload);
        toast.sucesso("Usuário atualizado com sucesso.");
      } else {
        await usuariosApi.criar(payload);
        toast.sucesso("Usuário cadastrado com sucesso.");
      }
      setModalAberto(false);
      recarregar();
    } catch (e2) {
      if (e2.camposInvalidos) {
        const mapa = {};
        e2.camposInvalidos.forEach((c) => (mapa[c.campo] = c.mensagem));
        setErros(mapa);
      }
      toast.erro(e2.message);
    } finally {
      setSalvando(false);
    }
  }

  async function confirmarRemocao() {
    setRemovendo(true);
    try {
      await usuariosApi.remover(paraRemover.id);
      toast.sucesso("Usuário removido.");
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
        titulo="Usuários"
        subtitulo="Alunos, professores, coordenadores e recepcionistas cadastrados no Schedemy."
        acao={
          <button className="btn-accent" onClick={abrirCriacao}>
            + Novo usuário
          </button>
        }
      />

      <div className="card mb-4 flex flex-wrap items-end gap-3 p-4">
        <TextField
          label="Buscar por nome"
          placeholder="Ex.: Fernanda"
          className="w-56"
          value={filtros.nome || ""}
          onChange={(e) => aplicarFiltros({ ...filtros, nome: e.target.value })}
        />
        <SelectField
          label="Tipo"
          className="w-48"
          placeholder="Todos os tipos"
          options={TIPOS_USUARIO}
          value={filtros.tipo || ""}
          onChange={(e) => aplicarFiltros({ ...filtros, tipo: e.target.value })}
        />
        <SelectField
          label="Status"
          className="w-40"
          placeholder="Todos"
          options={[
            { valor: "true", rotulo: "Ativos" },
            { valor: "false", rotulo: "Inativos" },
          ]}
          value={filtros.ativo ?? ""}
          onChange={(e) => aplicarFiltros({ ...filtros, ativo: e.target.value })}
        />
      </div>

      <Table
        carregando={carregando}
        chaveLinha={(u) => u.id}
        linhas={linhas}
        colunas={[
          { chave: "nome", titulo: "Nome", render: (u) => (
              <div>
                <p className="font-medium">{u.nome}</p>
                <p className="text-xs text-ink-700/60">{u.email}</p>
              </div>
            ) },
          { chave: "tipoUsuario", titulo: "Tipo", render: (u) => (
              <Pill className={CORES_TIPO_USUARIO[u.tipoUsuario]}>{u.tipoUsuario}</Pill>
            ) },
          { chave: "identificacao", titulo: "Matrícula/ID", render: (u) => u.matriculaRa || u.numIdentificacao || "—" },
          { chave: "departamento", titulo: "Departamento", render: (u) => u.departamento || "—" },
          { chave: "ativo", titulo: "Status", render: (u) => (
              <Pill className={u.ativo ? "bg-sage-100 text-sage-700" : "bg-brick-100 text-brick-700"}>
                {u.ativo ? "Ativo" : "Inativo"}
              </Pill>
            ) },
        ]}
        acoes={(u) => (
          <div className="flex justify-end gap-1">
            <button className="btn-ghost !px-2.5 !py-1 text-xs" onClick={() => abrirEdicao(u)}>
              Editar
            </button>
            <button className="btn-danger !px-2.5 !py-1 text-xs" onClick={() => setParaRemover(u)}>
              Remover
            </button>
          </div>
        )}
      />
      <Pagination pagina={pagina} onMudarPagina={setPaginaAtual} />

      <Modal
        aberto={modalAberto}
        onFechar={() => setModalAberto(false)}
        titulo={editando ? "Editar usuário" : "Novo usuário"}
        subtitulo={editando ? `#${editando.id} · ${editando.email}` : "Preencha os dados do novo usuário."}
      >
        <form onSubmit={salvar} className="space-y-4">
          <FieldGrid>
            <TextField
              label="Nome completo"
              required
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              error={erros.nome}
            />
            <TextField
              label="E-mail"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={erros.email}
            />
          </FieldGrid>
          <FieldGrid>
            <SelectField
              label="Tipo de usuário"
              required
              options={TIPOS_USUARIO}
              value={form.tipoUsuario}
              onChange={(e) => setForm({ ...form, tipoUsuario: e.target.value })}
            />
            <TextField
              label="Telefone (WhatsApp)"
              placeholder="27988887777"
              value={form.telefoneWhatsapp}
              onChange={(e) => setForm({ ...form, telefoneWhatsapp: e.target.value })}
            />
          </FieldGrid>
          <FieldGrid>
            <TextField
              label="Matrícula / RA"
              value={form.matriculaRa}
              onChange={(e) => setForm({ ...form, matriculaRa: e.target.value })}
            />
            <TextField
              label="Nº de identificação"
              placeholder="Ex.: PROF-0098"
              value={form.numIdentificacao}
              onChange={(e) => setForm({ ...form, numIdentificacao: e.target.value })}
            />
          </FieldGrid>
          <FieldGrid>
            <TextField
              label="Departamento"
              value={form.departamento}
              onChange={(e) => setForm({ ...form, departamento: e.target.value })}
            />
            <TextField
              label="ID Microsoft (SSO)"
              required
              value={form.idMicrosoft}
              onChange={(e) => setForm({ ...form, idMicrosoft: e.target.value })}
              error={erros.idMicrosoft}
            />
          </FieldGrid>

          <label className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-ink-100 text-clay-500 focus:ring-clay-500/40"
              checked={form.ativo}
              onChange={(e) => setForm({ ...form, ativo: e.target.checked })}
            />
            <span className="text-sm text-ink-800">Usuário ativo</span>
          </label>

          <div className="flex justify-end gap-2 border-t border-ink-100 pt-4">
            <button type="button" className="btn-ghost" onClick={() => setModalAberto(false)}>
              Cancelar
            </button>
            <button type="submit" className="btn-accent" disabled={salvando}>
              {salvando ? "Salvando…" : editando ? "Salvar alterações" : "Cadastrar"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        aberto={!!paraRemover}
        titulo="Remover usuário"
        descricao={`Tem certeza que deseja remover "${paraRemover?.nome}"? Essa ação não pode ser desfeita.`}
        confirmarRotulo="Remover"
        tom="danger"
        carregando={removendo}
        onConfirmar={confirmarRemocao}
        onCancelar={() => setParaRemover(null)}
      />
    </div>
  );
}
