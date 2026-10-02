import { api } from "./client";

export const registrosMotivoApi = {
  listarPorAgendamento: (agendamentoId, params) =>
    api.get(`/api/v1/registros-motivo/agendamentos/${agendamentoId}`, params),
  buscarPorId: (id) => api.get(`/api/v1/registros-motivo/${id}`),
  criar: (dto) => api.post("/api/v1/registros-motivo", dto),
};
