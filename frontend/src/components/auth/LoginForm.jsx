import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth, CONTAS_PADRAO } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

/** Ícone oficial da Microsoft (quatro quadrados). */
function MicrosoftIcon(props) {
  return (
    <svg viewBox="0 0 23 23" aria-hidden="true" {...props}>
      <rect x="1" y="1" width="10" height="10" fill="#f25022" />
      <rect x="12" y="1" width="10" height="10" fill="#7fba00" />
      <rect x="1" y="12" width="10" height="10" fill="#00a4ef" />
      <rect x="12" y="12" width="10" height="10" fill="#ffb900" />
    </svg>
  );
}

export default function LoginForm({ className = "" }) {
  const { entrar, carregando, erro } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const local = useLocation();

  const [identificador, setIdentificador] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

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
    <form onSubmit={aoSubmeter} className={`flex flex-col gap-6 ${className}`}>
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="font-display text-2xl font-bold text-ink-900">Entre na sua conta</h1>
        <p className="text-balance text-sm text-ink-700/70">
          Informe seu e-mail institucional para acessar o Schedemy
        </p>
      </div>

      <div className="flex flex-col gap-4">
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
          <div className="relative">
            <input
              id="senha"
              className="field-input pr-11"
              type={mostrarSenha ? "text" : "password"}
              autoComplete="current-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setMostrarSenha((v) => !v)}
              className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-ink-700/50 transition hover:text-brand-600"
              aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
            >
              {mostrarSenha ? (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8" />
                  <path d="M6.7 6.8C4.6 8.1 3 10 2 12c2 4 6 7 10 7 1.8 0 3.4-.5 4.9-1.4M19.5 16c1-1.1 1.9-2.5 2.5-4-2-4-6-7-10-7-.8 0-1.6.1-2.3.3" />
                </svg>
              ) : (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z" />
                  <circle cx="12" cy="12" r="2.6" />
                </svg>
              )}
            </button>
          </div>
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
          <button
            type="button"
            onClick={() => toast.info("As contas são criadas pela coordenação do curso.")}
            className="font-medium text-brand-600 underline underline-offset-4"
          >
            Solicite o acesso
          </button>
        </p>
      </div>

      <div className="border-t border-ink-100 pt-4">
        <p className="mb-2 text-center text-[11px] font-semibold uppercase tracking-wide text-ink-700/50">
          Contas de teste
        </p>
        <div className="flex flex-wrap justify-center gap-1.5">
          {CONTAS_PADRAO.map((conta) => (
            <button
              key={conta.usuario}
              type="button"
              onClick={() => usarConta(conta)}
              title={conta.papel}
              className="rounded-full border border-ink-100 bg-ink-50 px-3 py-1 text-xs font-medium text-ink-800 transition hover:border-brand-400 hover:text-brand-700"
            >
              {conta.usuario}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}
