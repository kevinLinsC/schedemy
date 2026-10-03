import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth, CONTAS_PADRAO } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import CampoSenha from "./CampoSenha";
import MicrosoftIcon from "./MicrosoftIcon";

export default function LoginForm({ className = "" }) {
  const { entrar, carregando, erro } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const local = useLocation();

  const [identificador, setIdentificador] = useState("");
  const [senha, setSenha] = useState("");

  async function aoSubmeter(e) {
    e.preventDefault();
    const ok = await entrar({ username: identificador.trim(), password: senha });
    if (ok) navigate(local.state?.de || "/", { replace: true });
  }

  function usarConta(conta) {
    setIdentificador(conta.usuario);
    setSenha(conta.senha);
  }

  return (
    <form onSubmit={aoSubmeter} className={`flex flex-col gap-3 [@media(min-height:700px)]:gap-4 [@media(min-height:820px)]:gap-5 ${className}`}>
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="font-display text-2xl font-bold text-ink-900">Entre na sua conta</h1>
        <p className="text-balance text-sm text-ink-700/70">
          Informe seu e-mail institucional para acessar o Schedemy
        </p>
      </div>

      <div className="flex flex-col gap-3.5">
        <div>
          <label htmlFor="email" className="field-label">
            E-mail institucional
          </label>
          <input
            id="email"
            className="field-input"
            type="text"
            autoComplete="username"
            inputMode="email"
            value={identificador}
            onChange={(e) => setIdentificador(e.target.value)}
            placeholder="nome.sobrenome@instituicao.edu.br"
            autoFocus
            required
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center gap-2">
            <label htmlFor="senha" className="field-label mb-0">
              Senha
            </label>
            <button
              type="button"
              onClick={() => toast.info("Procure a coordenação para redefinir sua senha institucional.")}
              className="ml-auto text-[11px] font-medium text-brand-600 underline-offset-4 hover:underline"
            >
              Esqueceu sua senha?
            </button>
          </div>
          <CampoSenha
            id="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>

        {erro && (
          <p role="alert" className="rounded-lg border border-brick-700/30 bg-brick-100 px-3 py-2 text-sm text-brick-700">
            {erro}
          </p>
        )}

        <button type="submit" className="btn-accent w-full" disabled={carregando}>
          {carregando ? "Entrando…" : "Entrar"}
        </button>
      </div>

      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-ink-100" />
        <span className="text-[11px] uppercase tracking-[0.08em] text-ink-700/50">Ou continue com</span>
        <span className="h-px flex-1 bg-ink-100" />
      </div>

      <div className="flex flex-col gap-4">
        <button
          type="button"
          className="btn-outline w-full"
          onClick={() =>
            toast.info("O acesso com a conta Microsoft institucional ainda será habilitado. Use seu e-mail e senha.")
          }
        >
          <MicrosoftIcon className="size-4" />
          Entrar com conta Microsoft
        </button>

        <p className="text-center text-sm text-ink-700/70">
          Não tem uma conta?{" "}
          <Link to="/cadastro" className="font-medium text-brand-600 underline underline-offset-4">
            Cadastre-se
          </Link>
        </p>
      </div>

      {/* Atalhos de acesso usados no dia a dia: ficam sempre visiveis. */}
      <div className="border-t border-ink-100 pt-2 [@media(min-height:700px)]:pt-3">
        <p className="mb-1 text-center text-[11px] font-semibold uppercase tracking-wide text-ink-700/50 [@media(min-height:700px)]:mb-1.5">
          Contas de teste
        </p>
        <div className="flex flex-wrap justify-center gap-1.5">
          {CONTAS_PADRAO.map((conta) => (
            <button
              key={conta.usuario}
              type="button"
              onClick={() => usarConta(conta)}
              title={conta.papel}
              className="rounded-full border border-ink-100 bg-ink-50 px-2.5 py-0.5 text-xs font-medium text-ink-800 transition hover:border-brand-400 hover:text-brand-700"
            >
              {conta.usuario}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}
