import { api } from "./client";

export const disponibilidadesApi = {
  listar: (params) => api.get("/api/v1/disponibilidades", params),
  buscarPorId: (id) => api.get(`/api/v1/disponibilidades/${id}`),
  criar: (dto) => api.post("/api/v1/disponibilidades", dto),
  atualizar: (id, dto) => api.put(`/api/v1/disponibilidades/${id}`, dto),
  remover: (id) => api.del(`/api/v1/disponibilidades/${id}`),
};
