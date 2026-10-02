import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROTULOS_PERFIL } from "../../utils/permissoes";

/** Exibida quando o usuário autenticado acessa uma área fora do seu perfil. */
export default function AcessoNegado() {
  const { perfil } = useAuth();

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="card max-w-md p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brick-100 text-brick-700">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
            <path d="M8 10.5V7.5a4 4 0 018 0v3" strokeLinecap="round" />
          </svg>
        </div>

        <h1 className="font-display text-xl text-ink-900">Acesso restrito</h1>
        <p className="mt-2 text-sm text-ink-700/70">
          Esta área não faz parte das funções do perfil
          {perfil ? ` ${ROTULOS_PERFIL[perfil] || perfil}` : ""}. Se você precisa
          dela, fale com a coordenação do curso.
        </p>

        <Link to="/" className="btn-accent mt-6 inline-flex">
          Voltar ao painel
        </Link>
      </div>
    </div>
  );
}
