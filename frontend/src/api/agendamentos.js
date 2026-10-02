import { api } from "./client";

export const agendamentosApi = {
  listarPorUsuario: (usuarioId, params) => api.get(`/api/v1/agendamentos/usuarios/${usuarioId}`, params),
  listarTodos: (params) => api.get("/api/v1/agendamentos", params),
  buscarPorId: (id) => api.get(`/api/v1/agendamentos/${id}`),
  criar: (dto) => api.post("/api/v1/agendamentos", dto),
  atualizar: (id, dto) => api.put(`/api/v1/agendamentos/${id}`, dto),
  responder: (id, dto) => api.patch(`/api/v1/agendamentos/${id}/resposta`, dto),
  cancelar: (id, dto) => api.patch(`/api/v1/agendamentos/${id}/cancelamento`, dto),
  remover: (id) => api.del(`/api/v1/agendamentos/${id}`),
};
