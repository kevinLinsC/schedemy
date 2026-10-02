import { useEffect, useState } from "react";
import Modal from "../../components/ui/Modal";
import { SelectField, TextField, TextAreaField, FieldGrid } from "../../components/ui/fields";
import Pill from "../../components/ui/Pill";
import { duracoesApi } from "../../api/duracoes";
import { useUsuariosOptions } from "../../hooks/useUsuariosOptions";
import { FORMATOS_REUNIAO, CORES_TIPO_USUARIO } from "../../utils/domain";
import { hojeISO } from "../../utils/format";

const FORM_VAZIO = {
  idOrganizador: "",
  idDuracao: "",
  dataReuniao: hojeISO(),
  horarioInicio: "10:00",
  formato: "PRESENCIAL",
  topico: "",
  resumo: "",
};

export default function NovoAgendamentoModal({ aberto, onFechar, onCriado, criarAgendamento }) {
  const { usuarios } = useUsuariosOptions();
  const [duracoes, setDuracoes] = useState([]);
  const [form, setForm] = useState(FORM_VAZIO);
  const [convidadosSelecionados, setConvidadosSelecionados] = useState([]);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (aberto) {
      duracoesApi.listar(true).then(setDuracoes).catch(() => setDuracoes([]));
      setForm(FORM_VAZIO);
      setConvidadosSelecionados([]);
      setErro("");
    }
  }, [aberto]);

  function alternarConvidado(id) {
    setConvidadosSelecionados((atual) =>
      atual.includes(id) ? atual.filter((c) => c !== id) : [...atual, id]
    );
  }

  const candidatosConvidado = usuarios.filter((u) => String(u.id) !== form.idOrganizador);

  async function salvar(e) {
    e.preventDefault();
    if (!form.idOrganizador) return setErro("Selecione o organizador do agendamento.");
    if (!form.idDuracao) return setErro("Selecione a duração da reunião.");
    if (convidadosSelecionados.length === 0) return setErro("Selecione ao menos um convidado.");
    if (!form.topico.trim()) return setErro("Informe o tópico da reunião.");

    setSalvando(true);
    setErro("");
    try {
      const payload = {
        idOrganizador: Number(form.idOrganizador),
        idsConvidados: convidadosSelecionados.map(Number),
        idDuracao: Number(form.idDuracao),
        dataReuniao: form.dataReuniao,
        horarioInicio: `${form.horarioInicio}:00`,
        formato: form.formato,
        topico: form.topico,
        resumo: form.resumo || null,
      };
      await criarAgendamento(payload);
      onCriado?.();
    } catch (e2) {
      setErro(e2.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Modal aberto={aberto} onFechar={onFechar} titulo="Novo agendamento" subtitulo="RN 01 a RN 18 são validadas pelo back-end." largura="max-w-2xl">
      <form onSubmit={salvar} className="space-y-4">
        <FieldGrid>
          <SelectField
            label="Organizador"
            required
            placeholder="Selecione…"
            options={usuarios.map((u) => ({ valor: u.id, rotulo: `${u.nome} (${u.tipoUsuario})` }))}
            value={form.idOrganizador}
            onChange={(e) => setForm({ ...form, idOrganizador: e.target.value })}
          />
          <SelectField
            label="Duração"
            required
            placeholder="Selecione…"
            options={duracoes.map((d) => ({ valor: d.id, rotulo: `${d.minutos} minutos` }))}
            value={form.idDuracao}
            onChange={(e) => setForm({ ...form, idDuracao: e.target.value })}
          />
        </FieldGrid>

        <div>
          <span className="field-label">
            Convidados <span className="text-brick-700">*</span>
          </span>
          <div className="max-h-44 space-y-1 overflow-y-auto rounded-lg border border-ink-100 p-2">
            {candidatosConvidado.length === 0 && <p className="p-2 text-xs text-ink-700/60">Selecione o organizador primeiro.</p>}
            {candidatosConvidado.map((u) => (
              <label key={u.id} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 hover:bg-ink-50">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-ink-100 text-clay-500 focus:ring-clay-500/40"
                  checked={convidadosSelecionados.includes(String(u.id))}
                  onChange={() => alternarConvidado(String(u.id))}
                />
                <span className="flex-1 text-sm text-ink-900">{u.nome}</span>
                <Pill className={CORES_TIPO_USUARIO[u.tipoUsuario]}>{u.tipoUsuario}</Pill>
              </label>
            ))}
          </div>
          <p className="mt-1 text-[11px] text-ink-700/60">É necessário ao menos 1 aluno e 1 professor/coordenador entre organizador e convidados.</p>
        </div>

        <FieldGrid colunas={3}>
          <label className="block">
            <span className="field-label">Data</span>
            <input
              type="date"
              className="field-input"
              value={form.dataReuniao}
              onChange={(e) => setForm({ ...form, dataReuniao: e.target.value })}
              required
            />
          </label>
          <label className="block">
            <span className="field-label">Horário</span>
            <input
              type="time"
              className="field-input"
              value={form.horarioInicio}
              onChange={(e) => setForm({ ...form, horarioInicio: e.target.value })}
              required
            />
          </label>
          <SelectField
            label="Formato"
            required
            options={FORMATOS_REUNIAO}
            value={form.formato}
            onChange={(e) => setForm({ ...form, formato: e.target.value })}
          />
        </FieldGrid>

        <TextField
          label="Tópico"
          required
          placeholder="Ex.: Dúvidas sobre TCC"
          value={form.topico}
          onChange={(e) => setForm({ ...form, topico: e.target.value })}
        />
        <TextAreaField
          label="Resumo (opcional)"
          placeholder="Detalhes adicionais sobre a reunião"
          value={form.resumo}
          onChange={(e) => setForm({ ...form, resumo: e.target.value })}
        />

        {erro && <p className="rounded-lg border border-brick-700/30 bg-brick-100 px-3 py-2 text-sm text-brick-700">{erro}</p>}

        <div className="flex justify-end gap-2 border-t border-ink-100 pt-4">
          <button type="button" className="btn-ghost" onClick={onFechar}>
            Cancelar
          </button>
          <button type="submit" className="btn-accent" disabled={salvando}>
            {salvando ? "Criando…" : "Criar agendamento"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
