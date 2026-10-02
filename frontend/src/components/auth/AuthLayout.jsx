import { Link } from "react-router-dom";

/**
 * Moldura das telas de acesso (login e cadastro): formulário à esquerda e
 * foto do campus com a marca à direita.
 */
export default function AuthLayout({ children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Coluna do formulário */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link to="/login" className="flex items-center gap-2 font-medium text-ink-900">
            <img
              src="/schedemy-logo.png"
              alt=""
              aria-hidden="true"
              className="size-7 rounded-md object-contain"
            />
            Schedemy
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center py-6">
          <div className="w-full max-w-sm">{children}</div>
        </div>

        <p className="text-center text-[11px] text-ink-700/50 md:text-left">
          Sistema de agendamentos acadêmicos
        </p>
      </div>

      {/* Coluna da imagem */}
      <div className="relative hidden bg-ink-900 lg:block">
        <img
          src="/campus.jpg"
          alt="Campus da instituição ao entardecer"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Véu azul da marca para dar contraste ao conteúdo sobreposto */}
        <div className="absolute inset-0 bg-brand-950/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-950/45 to-brand-900/25" />

        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center text-white">
          <img
            src="/schedemy-logo.png"
            alt="Logo do Schedemy"
            className="w-28 drop-shadow-[0_12px_28px_rgba(13,30,49,0.55)] xl:w-32"
          />
          <h2 className="mt-6 font-display text-5xl font-semibold tracking-tight drop-shadow-md">
            Schedemy
          </h2>
          <p className="mt-3 max-w-sm text-balance text-base leading-relaxed text-white/90 drop-shadow">
            Agendamentos acadêmicos organizados em um só lugar — alunos, professores,
            coordenação e recepção.
          </p>
        </div>
      </div>
    </div>
  );
}
