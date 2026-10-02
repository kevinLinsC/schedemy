import { api } from "./client";

export const usuariosApi = {
  listar: (params) => api.get("/api/v1/usuarios", params),
  buscarPorId: (id) => api.get(`/api/v1/usuarios/${id}`),
  criar: (dto) => api.post("/api/v1/usuarios", dto),
  atualizar: (id, dto) => api.put(`/api/v1/usuarios/${id}`, dto),
  remover: (id) => api.del(`/api/v1/usuarios/${id}`),
};
