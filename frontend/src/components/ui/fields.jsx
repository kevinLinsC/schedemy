export function TextField({ label, error, required, className = "", ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className="field-label">
        {label} {required && <span className="text-brick-700">*</span>}
      </span>
      <input className="field-input" {...props} />
      {error && <p className="field-error">{error}</p>}
    </label>
  );
}

export function TextAreaField({ label, error, required, className = "", ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className="field-label">
        {label} {required && <span className="text-brick-700">*</span>}
      </span>
      <textarea className="field-input min-h-[84px] resize-y" {...props} />
      {error && <p className="field-error">{error}</p>}
    </label>
  );
}

export function SelectField({ label, error, required, options, placeholder, className = "", ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className="field-label">
        {label} {required && <span className="text-brick-700">*</span>}
      </span>
      <select className="field-input" {...props}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opcao) =>
          typeof opcao === "object" ? (
            <option key={opcao.valor} value={opcao.valor}>
              {opcao.rotulo}
            </option>
          ) : (
            <option key={opcao} value={opcao}>
              {opcao}
            </option>
          )
        )}
      </select>
      {error && <p className="field-error">{error}</p>}
    </label>
  );
}

export function CheckboxField({ label, className = "", ...props }) {
  return (
    <label className={`flex items-center gap-2 ${className}`}>
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-ink-100 text-brand-600 focus:ring-brand-600/40"
        {...props}
      />
      <span className="text-sm text-ink-800">{label}</span>
    </label>
  );
}

export function FieldGrid({ children, colunas = 2 }) {
  const classesColunas = colunas === 3 ? "sm:grid-cols-3" : colunas === 1 ? "sm:grid-cols-1" : "sm:grid-cols-2";
  return <div className={`grid grid-cols-1 gap-4 ${classesColunas}`}>{children}</div>;
}
