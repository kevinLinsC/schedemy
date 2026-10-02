import { api } from "./client";

export const avaliacoesApi = {
  listarPorAluno: (alunoId, params) => api.get(`/api/v1/avaliacoes/alunos/${alunoId}`, params),
  buscarPorId: (id) => api.get(`/api/v1/avaliacoes/${id}`),
  criar: (dto) => api.post("/api/v1/avaliacoes", dto),
  atualizar: (id, dto) => api.put(`/api/v1/avaliacoes/${id}`, dto),
  remover: (id) => api.del(`/api/v1/avaliacoes/${id}`),
};
