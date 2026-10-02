import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { CORES_TIPO_USUARIO } from "../../utils/domain";
import { ROTULOS_PERFIL } from "../../utils/permissoes";
import Pill from "../ui/Pill";

// `permissao: null` significa visível para qualquer usuário autenticado.
const ITENS_NAV = [
  { to: "/", rotulo: "Painel", fim: true, icone: IconeGrid, permissao: null },
  { to: "/agendamentos", rotulo: "Agendamentos", icone: IconeCalendario, permissao: "agendamentos.ver" },
  { to: "/disponibilidades", rotulo: "Disponibilidades", icone: IconeRelogio, permissao: "disponibilidades.gerenciar" },
  { to: "/bloqueios", rotulo: "Bloqueios de período", icone: IconeBloqueio, permissao: "bloqueios.gerenciar" },
  { to: "/duracoes", rotulo: "Durações de reunião", icone: IconeTimer, permissao: "duracoes.gerenciar" },
  { to: "/usuarios", rotulo: "Usuários", icone: IconePessoas, permissao: "usuarios.gerenciar" },
  { to: "/avaliacoes", rotulo: "Avaliações", icone: IconeEstrela, permissao: "avaliacoes.ver" },
  { to: "/notificacoes", rotulo: "Notificações", icone: IconeSino, permissao: "notificacoes.ver" },
];

export default function AppLayout() {
  const { auth, perfilVinculado, perfil, pode, sair } = useAuth();
  const navigate = useNavigate();

  const itensVisiveis = ITENS_NAV.filter((item) => !item.permissao || pode(item.permissao));

  function aoSair() {
    sair();
    navigate("/login", { replace: true });
  }

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-64 shrink-0 flex-col border-r border-ink-100 bg-white/70 backdrop-blur-sm">
        <div className="flex items-center gap-2.5 px-5 py-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink-900 text-brand-600">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3.5" y="5.5" width="17" height="15" rx="2.5" />
              <path d="M3.5 10h17M8 3v4M16 3v4" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <p className="font-display text-lg leading-none text-ink-900">Schedemy</p>
            <p className="text-[11px] uppercase tracking-wide text-ink-700/60">Painel de agendamentos</p>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 px-3">
          {itensVisiveis.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.fim}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive ? "bg-ink-900 text-white shadow-soft" : "text-ink-800 hover:bg-ink-100"
                }`
              }
            >
              <item.icone className="h-4 w-4 shrink-0" />
              {item.rotulo}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-ink-100 px-4 py-4">
          <div className="flex items-center gap-2.5 rounded-xl bg-ink-50 px-3 py-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-900 text-xs font-semibold text-white">
              {auth?.username?.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink-900">
                {perfilVinculado?.nome || auth?.username}
              </p>
              {perfil && (
                <Pill className={CORES_TIPO_USUARIO[perfil] || "bg-ink-900 text-white"}>
                  {ROTULOS_PERFIL[perfil] || perfil}
                </Pill>
              )}
            </div>
            <button
              onClick={aoSair}
              className="shrink-0 rounded-lg p-1.5 text-ink-700/60 hover:bg-white hover:text-brick-700"
              aria-label="Sair"
              title="Sair"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function IconeGrid(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </svg>
  );
}
function IconeCalendario(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="3.5" y="5.5" width="17" height="15" rx="2.5" />
      <path d="M3.5 10h17M8 3v4M16 3v4" strokeLinecap="round" />
    </svg>
  );
}
function IconeRelogio(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconeBloqueio(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M6.5 6.5l11 11" strokeLinecap="round" />
    </svg>
  );
}
function IconeTimer(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="12" cy="13" r="7.5" />
      <path d="M12 9.5V13l2.3 1.5M9.5 2.5h5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconePessoas(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="9" cy="8" r="3" />
      <path d="M2.5 20c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5M16 8.2a3 3 0 110-5.9M17 13.7c2.6.5 4.5 2.8 4.5 5.5" strokeLinecap="round" />
    </svg>
  );
}
function IconeEstrela(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M12 3.5l2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" strokeLinejoin="round" />
    </svg>
  );
}
function IconeSino(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M6 9a6 6 0 1112 0c0 4 1.5 5.5 1.5 5.5h-15S6 13 6 9z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 18a2 2 0 004 0" strokeLinecap="round" />
    </svg>
  );
}
