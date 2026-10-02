import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getStoredAuth, setStoredAuth } from "../api/client";
import { usuariosApi } from "../api/usuarios";

const AuthContext = createContext(null);

/** Papéis pré-cadastrados no SecurityConfig do back-end, usados para o atalho de login. */
export const CONTAS_PADRAO = [
  { usuario: "admin", senha: "admin123", papel: "ADMIN / COORDENADOR / RECEPCIONISTA" },
  { usuario: "coordenador", senha: "coordenador123", papel: "COORDENADOR" },
  { usuario: "professor", senha: "professor123", papel: "PROFESSOR" },
  { usuario: "recepcionista", senha: "recepcionista123", papel: "RECEPCIONISTA" },
  { usuario: "aluno", senha: "aluno123", papel: "ALUNO" },
];

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => getStoredAuth());
  const [perfilVinculado, setPerfilVinculado] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  // Ao carregar uma sessão salva, tenta recarregar o perfil (Usuario) vinculado, se houver.
  useEffect(() => {
    if (auth?.usuarioId) {
      usuariosApi
        .buscarPorId(auth.usuarioId)
        .then(setPerfilVinculado)
        .catch(() => setPerfilVinculado(null));
    }
  }, [auth?.usuarioId]);

  const entrar = useCallback(async ({ username, password, usuarioId }) => {
    setCarregando(true);
    setErro(null);
    try {
      // Valida as credenciais chamando um endpoint protegido simples.
      setStoredAuth({ username, password, usuarioId: usuarioId || null });
      await usuariosApi.listar({ page: 0, size: 1 });
      const novaAuth = { username, password, usuarioId: usuarioId || null };
      setAuth(novaAuth);
      if (usuarioId) {
        try {
          setPerfilVinculado(await usuariosApi.buscarPorId(usuarioId));
        } catch {
          setPerfilVinculado(null);
        }
      }
      return true;
    } catch (e) {
      setStoredAuth(null);
      setAuth(null);
      setErro(
        e.status === 401 || e.status === 403
          ? "Usuário ou senha inválidos."
          : e.message || "Não foi possível entrar."
      );
      return false;
    } finally {
      setCarregando(false);
    }
  }, []);

  const sair = useCallback(() => {
    setStoredAuth(null);
    setAuth(null);
    setPerfilVinculado(null);
  }, []);

  const vincularPerfil = useCallback(
    (usuario) => {
      setPerfilVinculado(usuario);
      const novaAuth = { ...auth, usuarioId: usuario?.id ?? null };
      setAuth(novaAuth);
      setStoredAuth(novaAuth);
    },
    [auth]
  );

  const valor = useMemo(
    () => ({
      auth,
      estaAutenticado: !!auth,
      perfilVinculado,
      carregando,
      erro,
      entrar,
      sair,
      vincularPerfil,
    }),
    [auth, perfilVinculado, carregando, erro, entrar, sair, vincularPerfil]
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return ctx;
}
