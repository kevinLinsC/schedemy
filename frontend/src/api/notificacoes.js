import { api } from "./client";

export const notificacoesApi = {
  listar: (params) => api.get("/api/v1/notificacoes", params),
  buscarPorId: (id) => api.get(`/api/v1/notificacoes/${id}`),
  criar: (dto) => api.post("/api/v1/notificacoes", dto),
  marcarComoEnviada: (id) => api.patch(`/api/v1/notificacoes/${id}/enviar`),
  remover: (id) => api.del(`/api/v1/notificacoes/${id}`),
};
