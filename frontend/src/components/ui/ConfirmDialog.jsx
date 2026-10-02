import Modal from "./Modal";

export default function ConfirmDialog({
  aberto,
  titulo = "Confirmar ação",
  descricao,
  confirmarRotulo = "Confirmar",
  tom = "primary",
  carregando,
  onConfirmar,
  onCancelar,
}) {
  return (
    <Modal aberto={aberto} titulo={titulo} onFechar={onCancelar} largura="max-w-sm">
      <p className="text-sm text-ink-700">{descricao}</p>
      <div className="mt-6 flex justify-end gap-2">
        <button className="btn-ghost" onClick={onCancelar}>
          Cancelar
        </button>
        <button
          className={tom === "danger" ? "btn-danger !bg-brick-700 !text-white hover:!bg-brick-700/90" : "btn-primary"}
          onClick={onConfirmar}
          disabled={carregando}
        >
          {confirmarRotulo}
        </button>
      </div>
    </Modal>
  );
}
