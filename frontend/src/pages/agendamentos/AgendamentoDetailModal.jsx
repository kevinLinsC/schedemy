import { useState } from "react";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import Pill from "../../components/ui/Pill";
import { SelectField, TextAreaField } from "../../components/ui/fields";
import { agendamentosApi } from "../../api/agendamentos";
import { useToast } from "../../context/ToastContext";
import { CORES_STATUS_AGENDAMENTO, rotularEnum } from "../../utils/domain";
import { formatarData, formatarHora } from "../../utils/format";

export default function AgendamentoDetailModal({ agendamento, onFechar, onAlterado }) {
  const toast = useToast();
  const [participanteRecusando, setParticipanteRecusando] = useState(null);
  const [motivoRecusa, setMotivoRecusa] = useState("");
  const [respondendo, setRespondendo] = useState(false);

  const [modalCancelar, setModalCancelar] = useState(false);
  const [idQuemCancela, setIdQuemCancela] = useState("");
  const [motivoCancelamento, setMotivoCancelamento] = useState("");
  const [cancelando, setCancelando] = useState(false);

  const [modalRemover, setModalRemover] = useState(false);
  const [removendo, setRemovendo] = useState(false);

  if (!agendamento) return null;
  const a = agendamento;
  const podeCancelar = a.status !== "CANCELADO" && a.status !== "CONCLUIDO";
  const podeRemover = a.status === "PENDENTE" || a.status === "CANCELADO";

  async function responder(participante, aceitar, motivo) {
    setRespondendo(true);
    try {
      await agendamentosApi.responder(a.id, { idUsuario: participante.idUsuario, aceitar, motivo: motivo || null });
      toast.sucesso(aceitar ? `${participante.nomeUsuario} aceitou o convite.` : `${participante.nomeUsuario} recusou o convite.`);
      setParticipanteRecusando(null);
      setMotivoRecusa("");
      onAlterado();
    } catch (e) {
      toast.erro(e.message);
    } finally {
      setRespondendo(false);
    }
  }

  async function confirmarCancelamento() {
    if (!idQuemCancela) return toast.erro("Selecione quem está cancelando.");
    if (!motivoCancelamento.trim()) return toast.erro("Informe o motivo do cancelamento.");
    setCancelando(true);
    try {
      await agendamentosApi.cancelar(a.id, {
        idUsuario: Number(idQuemCancela),
        motivo: motivoCancelamento,
        confirmar: true,
      });
      toast.sucesso("Agendamento cancelado.");
      setModalCancelar(false);
      onAlterado();
      onFechar();
    } catch (e) {
      toast.erro(e.message);
    } finally {
      setCancelando(false);
    }
  }

  async function confirmarRemocao() {
    setRemovendo(true);
    try {
      await agendamentosApi.remover(a.id);
      toast.sucesso("Agendamento removido.");
      onAlterado();
      onFechar();
    } catch (e) {
      toast.erro(e.message);
    } finally {
      setRemovendo(false);
    }
  }

  return (
    <>
      <Modal aberto={!!agendamento} onFechar={onFechar} titulo={a.topico} subtitulo={`Agendamento #${a.id}`} largura="max-w-2xl">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <Pill className={CORES_STATUS_AGENDAMENTO[a.status]}>{rotularEnum(a.status)}</Pill>
            <Pill className="bg-ink-100 text-ink-800">{rotularEnum(a.formato)}</Pill>
            <Pill className="bg-ink-100 text-ink-800">{a.duracaoMinutos} min</Pill>
          </div>

          <div className="grid grid-cols-2 gap-4 rounded-xl bg-ink-50 p-4 text-sm sm:grid-cols-4">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-ink-700/60">Data</p>
              <p className="font-medium text-ink-900">{formatarData(a.dataReuniao)}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-ink-700/60">Horário</p>
              <p className="font-medium text-ink-900">
                {formatarHora(a.horarioInicio)} – {formatarHora(a.horarioFim)}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-[11px] uppercase tracking-wide text-ink-700/60">Organizador</p>
              <p className="font-medium text-ink-900">{a.nomeOrganizador}</p>
            </div>
          </div>

          {a.resumo && (
            <div>
              <p className="field-label">Resumo</p>
              <p className="text-sm text-ink-800">{a.resumo}</p>
            </div>
          )}

          {a.salaVirtual && (
            <div className="rounded-xl border border-ink-600/20 bg-ink-100/60 p-3.5">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-700">Sala virtual</p>
              <a
                href={a.salaVirtual.linkTeams}
                target="_blank"
                rel="noreferrer"
                className="mt-1 block truncate text-sm font-medium text-clay-600 hover:underline"
              >
                {a.salaVirtual.linkTeams}
              </a>
            </div>
          )}

          <div>
            <p className="field-label mb-2">Participantes</p>
            <ul className="divide-y divide-ink-100 rounded-xl border border-ink-100">
              {a.participantes.map((p) => (
                <li key={p.idUsuario} className="flex items-center justify-between gap-3 px-3.5 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink-900">{p.nomeUsuario}</p>
                    <p className="text-xs text-ink-700/60">{rotularEnum(p.papel)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {p.statusResposta === "PENDENTE" && a.status !== "CANCELADO" ? (
                      <>
                        <button
                          className="btn-ghost !px-2.5 !py-1 text-xs !text-sage-700 hover:!bg-sage-100"
                          disabled={respondendo}
                          onClick={() => responder(p, true)}
                        >
                          Aceitar
                        </button>
                        <button
                          className="btn-ghost !px-2.5 !py-1 text-xs !text-brick-700 hover:!bg-brick-100"
                          disabled={respondendo}
                          onClick={() => setParticipanteRecusando(p)}
                        >
                          Recusar
                        </button>
                      </>
                    ) : (
                      <Pill
                        className={
                          p.statusResposta === "ACEITO"
                            ? "bg-sage-100 text-sage-700"
                            : p.statusResposta === "RECUSADO"
                            ? "bg-brick-100 text-brick-700"
                            : "bg-ink-100 text-ink-800"
                        }
                      >
                        {rotularEnum(p.statusResposta)}
                      </Pill>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {participanteRecusando && (
            <div className="rounded-xl border border-brick-700/30 bg-brick-100 p-4">
              <p className="mb-2 text-sm font-semibold text-brick-700">
                Motivo da recusa de {participanteRecusando.nomeUsuario}
              </p>
              <TextAreaField
                label="Justificativa"
                required
                value={motivoRecusa}
                onChange={(e) => setMotivoRecusa(e.target.value)}
                placeholder="Ex.: Conflito de horário"
              />
              <div className="mt-2 flex justify-end gap-2">
                <button className="btn-ghost !py-1 text-xs" onClick={() => setParticipanteRecusando(null)}>
                  Cancelar
                </button>
                <button
                  className="btn-danger !bg-brick-700 !text-white !py-1 text-xs hover:!bg-brick-700/90"
                  disabled={!motivoRecusa.trim() || respondendo}
                  onClick={() => responder(participanteRecusando, false, motivoRecusa)}
                >
                  Confirmar recusa
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-wrap justify-end gap-2 border-t border-ink-100 pt-4">
            {podeRemover && (
              <button className="btn-danger" onClick={() => setModalRemover(true)}>
                Remover definitivamente
              </button>
            )}
            {podeCancelar && (
              <button
                className="btn !bg-brick-700 !text-white hover:!bg-brick-700/90"
                onClick={() => setModalCancelar(true)}
              >
                Cancelar agendamento
              </button>
            )}
            <button className="btn-ghost" onClick={onFechar}>
              Fechar
            </button>
          </div>
        </div>
      </Modal>

      <Modal aberto={modalCancelar} onFechar={() => setModalCancelar(false)} titulo="Cancelar agendamento" largura="max-w-md">
        <div className="space-y-4">
          <SelectField
            label="Quem está cancelando?"
            required
            placeholder="Selecione um participante…"
            options={a.participantes.map((p) => ({ valor: p.idUsuario, rotulo: p.nomeUsuario }))}
            value={idQuemCancela}
            onChange={(e) => setIdQuemCancela(e.target.value)}
          />
          <TextAreaField
            label="Motivo do cancelamento"
            required
            value={motivoCancelamento}
            onChange={(e) => setMotivoCancelamento(e.target.value)}
            placeholder="Ex.: Imprevisto pessoal"
          />
          <p className="text-xs text-ink-700/60">
            O cancelamento exige confirmação e no mínimo 1 hora de antecedência em relação ao horário da reunião (RN 05).
          </p>
          <div className="flex justify-end gap-2 border-t border-ink-100 pt-4">
            <button className="btn-ghost" onClick={() => setModalCancelar(false)}>
              Voltar
            </button>
            <button
              className="btn !bg-brick-700 !text-white hover:!bg-brick-700/90"
              disabled={cancelando}
              onClick={confirmarCancelamento}
            >
              {cancelando ? "Cancelando…" : "Confirmar cancelamento"}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        aberto={modalRemover}
        titulo="Remover agendamento"
        descricao="Essa ação remove definitivamente o agendamento (permitido apenas para PENDENTE ou CANCELADO)."
        confirmarRotulo="Remover"
        tom="danger"
        carregando={removendo}
        onConfirmar={confirmarRemocao}
        onCancelar={() => setModalRemover(false)}
      />
    </>
  );
}
