import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usuariosApi } from "../../api/usuarios";
import { useToast } from "../../context/ToastContext";
import CampoSenha from "./CampoSenha";
import MicrosoftIcon from "./MicrosoftIcon";

const SENHA_MIN = 8;

/** Valida os campos no cliente e devolve um mapa { campo: mensagem }. */
function validar({ nome, email, senha, confirmacao }) {
  const erros = {};

  if (!nome.trim()) erros.nome = "Informe seu nome completo.";
  else if (nome.trim().length < 3) erros.nome = "O nome deve ter ao menos 3 caracteres.";
  else if (!nome.trim().includes(" ")) erros.nome = "Informe o nome e o sobrenome.";

  if (!email.trim()) erros.email = "Informe seu e-mail institucional.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) erros.email = "Informe um e-mail válido.";

  if (!senha) erros.senha = "Crie uma senha.";
  else if (senha.length < SENHA_MIN) erros.senha = `A senha deve ter no mínimo ${SENHA_MIN} caracteres.`;

  if (!confirmacao) erros.confirmacao = "Confirme a senha.";
  else if (confirmacao !== senha) erros.confirmacao = "As senhas não coincidem.";

  return erros;
}

export default function CadastroForm({ className = "" }) {
  const toast = useToast();
  const navigate = useNavigate();

  const [campos, setCampos] = useState({ nome: "", email: "", senha: "", confirmacao: "" });
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState(null);
  const [enviando, setEnviando] = useState(false);

  function alterar(campo, valor) {
    setCampos((atual) => ({ ...atual, [campo]: valor }));
    setErros((atual) => (atual[campo] ? { ...atual, [campo]: undefined } : atual));
  }

  async function aoSubmeter(e) {
    e.preventDefault();
    setErroGeral(null);

    const encontrados = validar(campos);
    setErros(encontrados);
    if (Object.keys(encontrados).length > 0) return;

    setEnviando(true);
    try {
      await usuariosApi.criar({
        nome: campos.nome.trim(),
        email: campos.email.trim(),
        tipoUsuario: "ALUNO",
        ativo: true,
      });
      toast.sucesso("Conta criada! Faça login para continuar.");
      navigate("/login", { replace: true });
    } catch (erro) {
      // O endpoint de usuários exige autenticação: enquanto o cadastro público
      // não for liberado no back-end, orientamos o usuário a procurar a coordenação.
      if (erro.status === 401 || erro.status === 403) {
        setErroGeral(
          "O cadastro por esta tela ainda não está liberado. Procure a coordenação do curso para criar seu acesso."
        );
      } else if (erro.camposInvalidos) {
        setErros(erro.camposInvalidos);
        setErroGeral(erro.message);
      } else {
        setErroGeral(erro.message || "Não foi possível criar a conta.");
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={aoSubmeter} noValidate className={`flex flex-col gap-4 sm:gap-5 ${className}`}>
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="font-display text-2xl font-bold text-ink-900">Crie sua conta</h1>
        <p className="text-balance text-sm text-ink-700/70">
          Preencha os dados abaixo para criar sua conta no Schedemy
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <div>
          <label htmlFor="nome" className="field-label">
            Nome completo
          </label>
          <input
            id="nome"
            className="field-input"
            type="text"
            autoComplete="name"
            value={campos.nome}
            onChange={(e) => alterar("nome", e.target.value)}
            placeholder="João da Silva"
            aria-invalid={!!erros.nome || undefined}
            autoFocus
          />
          {erros.nome && <p className="field-error">{erros.nome}</p>}
        </div>

        <div>
          <label htmlFor="email" className="field-label">
            E-mail institucional
          </label>
          <input
            id="email"
            className="field-input"
            type="email"
            autoComplete="email"
            value={campos.email}
            onChange={(e) => alterar("email", e.target.value)}
            placeholder="nome.sobrenome@instituicao.edu.br"
            aria-invalid={!!erros.email || undefined}
          />
          {erros.email ? (
            <p className="field-error">{erros.email}</p>
          ) : (
            <p className="mt-0.5 text-[11.5px] leading-snug text-ink-700/60">
              Usaremos este endereço para enviar as confirmações de agendamento.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="senha" className="field-label">
            Senha
          </label>
          <CampoSenha
            id="senha"
            autoComplete="new-password"
            value={campos.senha}
            onChange={(e) => alterar("senha", e.target.value)}
            invalido={!!erros.senha}
          />
          {erros.senha ? (
            <p className="field-error">{erros.senha}</p>
          ) : (
            <p className="mt-0.5 text-[11.5px] leading-snug text-ink-700/60">
              Deve ter no mínimo {SENHA_MIN} caracteres.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="confirmacao" className="field-label">
            Confirmar senha
          </label>
          <CampoSenha
            id="confirmacao"
            autoComplete="new-password"
            value={campos.confirmacao}
            onChange={(e) => alterar("confirmacao", e.target.value)}
            invalido={!!erros.confirmacao}
          />
          {erros.confirmacao && <p className="field-error">{erros.confirmacao}</p>}
        </div>

        {erroGeral && (
          <p
            role="alert"
            className="rounded-lg border border-brick-700/30 bg-brick-100 px-3 py-2 text-sm text-brick-700"
          >
            {erroGeral}
          </p>
        )}

        <button type="submit" className="btn-accent w-full" disabled={enviando}>
          {enviando ? "Criando conta…" : "Criar conta"}
        </button>
      </div>

      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-ink-100" />
        <span className="text-[11px] uppercase tracking-[0.08em] text-ink-700/50">Ou continue com</span>
        <span className="h-px flex-1 bg-ink-100" />
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          className="btn-outline w-full"
          onClick={() => toast.info("O cadastro com a conta Microsoft institucional ainda será habilitado.")}
        >
          <MicrosoftIcon className="size-4" />
          Cadastrar com conta Microsoft
        </button>

        <p className="text-center text-sm text-ink-700/70">
          Já tem uma conta?{" "}
          <Link to="/login" className="font-medium text-brand-600 underline underline-offset-4">
            Entrar
          </Link>
        </p>
      </div>
    </form>
  );
}
