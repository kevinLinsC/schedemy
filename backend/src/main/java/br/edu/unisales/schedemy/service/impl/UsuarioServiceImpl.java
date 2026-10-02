package br.edu.unisales.schedemy.service.impl;

import br.edu.unisales.schedemy.domain.entity.Usuario;
import br.edu.unisales.schedemy.domain.enums.TipoUsuario;
import br.edu.unisales.schedemy.dto.request.UsuarioRequestDTO;
import br.edu.unisales.schedemy.dto.response.UsuarioResponseDTO;
import br.edu.unisales.schedemy.exception.RecursoDuplicadoException;
import br.edu.unisales.schedemy.exception.RecursoNaoEncontradoException;
import br.edu.unisales.schedemy.mapper.UsuarioMapper;
import br.edu.unisales.schedemy.repository.UsuarioRepository;
import br.edu.unisales.schedemy.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioMapper usuarioMapper;

    @Override
    public UsuarioResponseDTO criar(UsuarioRequestDTO dto) {
        if (usuarioRepository.existsByEmail(dto.email())) {
            throw new RecursoDuplicadoException("Ja existe um usuario cadastrado com o email: " + dto.email());
        }
        if (usuarioRepository.existsByIdMicrosoft(dto.idMicrosoft())) {
            throw new RecursoDuplicadoException("Ja existe um usuario cadastrado com este idMicrosoft.");
        }
        Usuario usuario = usuarioMapper.paraEntidade(dto);
        usuario = usuarioRepository.save(usuario);
        return usuarioMapper.paraResponseDTO(usuario);
    }

    @Override
    @Transactional(readOnly = true)
    public UsuarioResponseDTO buscarPorId(Long id) {
        return usuarioMapper.paraResponseDTO(buscarEntidadePorId(id));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UsuarioResponseDTO> listar(TipoUsuario tipo, String nome, Boolean ativo, Pageable pageable) {
        return usuarioRepository.buscarComFiltros(tipo, nome, ativo, pageable)
                .map(usuarioMapper::paraResponseDTO);
    }

    @Override
    public UsuarioResponseDTO atualizar(Long id, UsuarioRequestDTO dto) {
        Usuario usuario = buscarEntidadePorId(id);

        usuarioRepository.findByEmail(dto.email()).ifPresent(outro -> {
            if (!outro.getId().equals(id)) {
                throw new RecursoDuplicadoException("Ja existe outro usuario cadastrado com o email: " + dto.email());
            }
        });

        usuarioMapper.atualizarEntidade(usuario, dto);
        usuario = usuarioRepository.save(usuario);
        return usuarioMapper.paraResponseDTO(usuario);
    }

    @Override
    public void deletar(Long id) {
        Usuario usuario = buscarEntidadePorId(id);
        usuarioRepository.delete(usuario);
    }

    private Usuario buscarEntidadePorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> RecursoNaoEncontradoException.paraEntidade("Usuario", id));
    }
}