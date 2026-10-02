import { useState } from "react";

/** Campo de senha com botão de mostrar/ocultar, usado no login e no cadastro. */
export default function CampoSenha({ id, value, onChange, autoComplete = "current-password", invalido = false }) {
  const [visivel, setVisivel] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        className="field-input pr-11"
        type={visivel ? "text" : "password"}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        aria-invalid={invalido || undefined}
      />
      <button
        type="button"
        onClick={() => setVisivel((v) => !v)}
        className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-ink-700/50 transition hover:text-brand-600"
        aria-label={visivel ? "Ocultar senha" : "Mostrar senha"}
      >
        {visivel ? (
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
  );
}
