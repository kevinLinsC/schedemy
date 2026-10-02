import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth, CONTAS_PADRAO } from "../context/AuthContext";

export default function LoginPage() {
  const { entrar, carregando, erro } = useAuth();
  const navigate = useNavigate();
  const local = useLocation();
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  async function aoSubmeter(e) {
    e.preventDefault();
    const ok = await entrar({ username: usuario, password: senha });
    if (ok) {
      navigate(local.state?.de || "/", { replace: true });
    }
  }

  function usarConta(conta) {
    setUsuario(conta.usuario);
    setSenha(conta.senha);
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-lift md:grid-cols-2">
        {/* Lado ilustrativo */}
        <div className="relative hidden flex-col justify-between bg-gradient-to-br from-ink-900 via-ink-800 to-ink-600 p-10 text-white md:flex">
          <div>
            <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-clay-500">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3.5" y="5.5" width="17" height="15" rx="2.5" />
                <path d="M3.5 10h17M8 3v4M16 3v4" strokeLinecap="round" />
              </svg>
            </div>
            <h1 className="font-display text-4xl leading-[1.1]">
              Agendar reuniões acadêmicas nunca foi tão simples.
            </h1>
            <p className="mt-4 text-sm text-white/70">
              Alunos, professores, coordenadores e recepção — tudo em um só lugar, dentro do AVA.
            </p>
          </div>
          <p className="text-xs text-white/50">Sistema de Agendamento de Reuniões no AVA</p>
        </div>

        {/* Formulário */}
        <div className="p-8 sm:p-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-clay-600">Bem-vindo de volta</p>
          <h2 className="mt-1 font-display text-2xl text-ink-900">Entrar no Schedemy</h2>
          <p className="mt-1 text-sm text-ink-700/70">Use suas credenciais da API para continuar.</p>

          <form onSubmit={aoSubmeter} className="mt-6 space-y-4">
            <label className="block">
              <span className="field-label">Usuário</span>
              <input
                className="field-input"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="admin"
                autoFocus
                required
              />
            </label>
            <label className="block">
              <span className="field-label">Senha</span>
              <input
                className="field-input"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                required
              />
            </label>

            {erro && (
              <p className="rounded-lg border border-brick-700/30 bg-brick-100 px-3 py-2 text-sm text-brick-700">
                {erro}
              </p>
            )}

            <button type="submit" className="btn-accent w-full" disabled={carregando}>
              {carregando ? "Entrando…" : "Entrar"}
            </button>
          </form>

          <div className="mt-7 border-t border-ink-100 pt-5">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-ink-700/60">
              Contas de teste (SecurityConfig)
            </p>
            <div className="flex flex-wrap gap-1.5">
              {CONTAS_PADRAO.map((conta) => (
                <button
                  key={conta.usuario}
                  type="button"
                  onClick={() => usarConta(conta)}
                  className="rounded-full border border-ink-100 bg-ink-50 px-3 py-1 text-xs font-medium text-ink-800 hover:border-clay-500 hover:text-clay-600"
                  title={conta.papel}
                >
                  {conta.usuario}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
