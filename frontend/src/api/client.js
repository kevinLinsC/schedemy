const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const AUTH_STORAGE_KEY = "schedemy.auth";

/** Classe de erro rica, carregando o corpo padronizado de erro da API (ErrorResponseDTO). */
export class ApiError extends Error {
  constructor(status, body) {
    super(body?.mensagem || `Erro ${status} ao comunicar com a API.`);
    this.status = status;
    this.body = body;
    this.camposInvalidos = body?.camposInvalidos || null;
  }
}

export function getStoredAuth() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredAuth(auth) {
  if (auth) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

function buildAuthHeader() {
  const auth = getStoredAuth();
  if (!auth?.username) return null;
  const token = btoa(`${auth.username}:${auth.password}`);
  return `Basic ${token}`;
}

/**
 * Wrapper central de requisições HTTP para a Schedemy API.
 * - injeta o header Authorization (Basic Auth) quando houver sessão salva;
 * - serializa/desserializa JSON automaticamente;
 * - normaliza erros no formato ErrorResponseDTO do backend em uma ApiError.
 */
export async function apiFetch(path, { method = "GET", body, params, signal } = {}) {
  const url = new URL(path.startsWith("http") ? path : `${BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([chave, valor]) => {
      if (valor !== undefined && valor !== null && valor !== "") {
        url.searchParams.set(chave, valor);
      }
    });
  }

  const headers = { Accept: "application/json" };
  const authHeader = buildAuthHeader();
  if (authHeader) headers.Authorization = authHeader;
  if (body !== undefined) headers["Content-Type"] = "application/json";

  let response;
  try {
    response = await fetch(url.toString(), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch {
    throw new ApiError(0, {
      mensagem:
        "Não foi possível conectar à API. Verifique se o back-end está rodando em " +
        BASE_URL +
        " e se o CORS está liberado.",
    });
  }

  if (response.status === 204) {
    return null;
  }

  const textoBruto = await response.text();
  const dados = textoBruto ? safeJsonParse(textoBruto) : null;

  if (!response.ok) {
    throw new ApiError(response.status, dados);
  }
  return dados;
}

function safeJsonParse(texto) {
  try {
    return JSON.parse(texto);
  } catch {
    return { mensagem: texto };
  }
}

export const api = {
  get: (path, params, signal) => apiFetch(path, { method: "GET", params, signal }),
  post: (path, body) => apiFetch(path, { method: "POST", body }),
  put: (path, body) => apiFetch(path, { method: "PUT", body }),
  patch: (path, body) => apiFetch(path, { method: "PATCH", body }),
  del: (path) => apiFetch(path, { method: "DELETE" }),
};

export { BASE_URL };
