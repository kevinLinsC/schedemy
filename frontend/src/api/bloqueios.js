import { api } from "./client";

export const bloqueiosApi = {
  listar: (params) => api.get("/api/v1/bloqueios-periodo", params),
  buscarPorId: (id) => api.get(`/api/v1/bloqueios-periodo/${id}`),
  criar: (dto) => api.post("/api/v1/bloqueios-periodo", dto),
  atualizar: (id, dto) => api.put(`/api/v1/bloqueios-periodo/${id}`, dto),
  remover: (id) => api.del(`/api/v1/bloqueios-periodo/${id}`),
  listarImpactados: (id) => api.get(`/api/v1/bloqueios-periodo/${id}/agendamentos-impactados`),
};
