import { useCallback, useEffect, useState } from "react";
import { useToast } from "../context/ToastContext";

/**
 * Encapsula o padrão comum de listagem paginada da Schedemy API:
 * mantém filtros, página atual, estado de carregamento e permite recarregar
 * após operações de criação/edição/remoção.
 *
 * `buscar` deve ser uma função (params) => Promise<PageResponseDTO>.
 */
export function usePaginatedList(buscar, { tamanhoPagina = 10, filtrosIniciais = {}, ordenarPor } = {}) {
  const toast = useToast();
  const [filtros, setFiltros] = useState(filtrosIniciais);
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [pagina, setPagina] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const recarregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const params = { ...filtros, page: paginaAtual, size: tamanhoPagina };
      if (ordenarPor) params.sort = ordenarPor;
      const resultado = await buscar(params);
      setPagina(resultado);
    } catch (e) {
      setErro(e.message);
      toast.erro(e.message);
    } finally {
      setCarregando(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buscar, filtros, paginaAtual, tamanhoPagina, ordenarPor]);

  useEffect(() => {
    recarregar();
  }, [recarregar]);

  const aplicarFiltros = useCallback((novosFiltros) => {
    setFiltros(novosFiltros);
    setPaginaAtual(0);
  }, []);

  return {
    pagina,
    linhas: pagina?.conteudo ?? [],
    carregando,
    erro,
    filtros,
    aplicarFiltros,
    paginaAtual,
    setPaginaAtual,
    recarregar,
  };
}
