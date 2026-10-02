import { api } from "./client";

export const duracoesApi = {
  listar: (apenasAtivas = false) => api.get("/api/v1/duracoes-reuniao", { ativas: apenasAtivas }),
  buscarPorId: (id) => api.get(`/api/v1/duracoes-reuniao/${id}`),
  criar: (dto) => api.post("/api/v1/duracoes-reuniao", dto),
  atualizar: (id, dto) => api.put(`/api/v1/duracoes-reuniao/${id}`, dto),
  remover: (id) => api.del(`/api/v1/duracoes-reuniao/${id}`),
};
