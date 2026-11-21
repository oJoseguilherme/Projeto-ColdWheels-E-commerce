package io.github.ojoseguilherme.service;

import java.time.Year;
import java.util.List;

import io.github.ojoseguilherme.dto.PistaRequestDTO;
import io.github.ojoseguilherme.dto.PistaResponseDTO;
import io.github.ojoseguilherme.exception.BusinessValidationException;
import io.github.ojoseguilherme.exception.DuplicateResourceException;
import io.github.ojoseguilherme.exception.ResourceNotFoundException;
import io.github.ojoseguilherme.mapper.PistaMapper;
import io.github.ojoseguilherme.model.Arquivo;
import io.github.ojoseguilherme.model.Fornecedor;
import io.github.ojoseguilherme.model.Marca;
import io.github.ojoseguilherme.model.Pista;
import io.github.ojoseguilherme.repository.FornecedorRepository;
import io.github.ojoseguilherme.repository.MarcaRepository;
import io.github.ojoseguilherme.repository.PistaRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class PistaServiceImpl implements PistaService {

    private static final int PRIMEIRO_ANO_COLD_WHEELS = 1968;

    @Inject
    PistaRepository repository;

    @Inject
    MarcaRepository marcaRepository;

    @Inject
    FornecedorRepository fornecedorRepository;

    @Inject
    ArquivoService arquivoService;

    @Override
    public List<PistaResponseDTO> findAll() {
        return repository.listAll()
                .stream()
                .map(PistaMapper::toResponseDTO)
                .toList();
    }

    @Override
    public PistaResponseDTO findById(Long id) {
        return PistaMapper.toResponseDTO(findEntityById(id));
    }

    @Override
    @Transactional
    public PistaResponseDTO create(PistaRequestDTO dto) {
        validarAnoLancamento(dto.anoLancamento());

        String nomeNormalizado = normalizar(dto.nome());

        if (repository.existsByNome(nomeNormalizado)) {
            throw new DuplicateResourceException(
                    "Já existe uma pista com o nome '" + nomeNormalizado + "'.");
        }

        Pista pista = PistaMapper.toEntity(dto);
        normalizarCamposTexto(pista);
        vincularMarcaEFornecedor(pista, dto.idMarca(), dto.idFornecedor());

        repository.persist(pista);

        return PistaMapper.toResponseDTO(pista);
    }

    @Override
    @Transactional
    public PistaResponseDTO update(Long id, PistaRequestDTO dto) {
        Pista pista = findEntityById(id);

        validarAnoLancamento(dto.anoLancamento());

        String nomeNormalizado = normalizar(dto.nome());

        if (repository.existsByNomeAndIdNot(nomeNormalizado, id)) {
            throw new DuplicateResourceException(
                    "Já existe outra pista com o nome '" + nomeNormalizado + "'.");
        }

        PistaMapper.updateEntity(pista, dto);
        normalizarCamposTexto(pista);
        vincularMarcaEFornecedor(pista, dto.idMarca(), dto.idFornecedor());

        return PistaMapper.toResponseDTO(pista);
    }


    @Override
    @Transactional
    public void delete(Long id) {
        Pista pista = findEntityById(id);
        Arquivo principal = pista.getImagemPrincipal();
        Arquivo secundaria = pista.getImagemSecundaria();
        pista.setImagemPrincipal(null);
        pista.setImagemSecundaria(null);

        repository.delete(pista);
        repository.flush();

        arquivoService.excluir(principal);
        arquivoService.excluir(secundaria);
    }

    @Override
    @Transactional
    public PistaResponseDTO atualizarImagem(Long id, String slot, String nomeOriginal, String contentType, byte[] conteudo) {
        boolean isPrincipal = isSlotPrincipal(slot);
        Pista pista = findEntityById(id);

        Arquivo anterior = isPrincipal ? pista.getImagemPrincipal() : pista.getImagemSecundaria();
        Arquivo novo = arquivoService.salvarImagem("pistas/" + id, nomeOriginal, contentType, conteudo);

        if (isPrincipal) {
            pista.setImagemPrincipal(novo);
        } else {
            pista.setImagemSecundaria(novo);
        }
        repository.flush();

        if (anterior != null) {
            arquivoService.excluir(anterior);
        }
        return PistaMapper.toResponseDTO(pista);
    }

    @Override
    @Transactional
    public PistaResponseDTO removerImagem(Long id, String slot) {
        boolean isPrincipal = isSlotPrincipal(slot);
        Pista pista = findEntityById(id);

        Arquivo alvo = isPrincipal ? pista.getImagemPrincipal() : pista.getImagemSecundaria();
        if (alvo == null) {
            return PistaMapper.toResponseDTO(pista);
        }

        if (isPrincipal) {
            pista.setImagemPrincipal(null);
        } else {
            pista.setImagemSecundaria(null);
        }
        repository.flush();

        arquivoService.excluir(alvo);
        return PistaMapper.toResponseDTO(pista);
    }

    private boolean isSlotPrincipal(String slot) {
        if ("principal".equalsIgnoreCase(slot)) {
            return true;
        }
        if ("secundaria".equalsIgnoreCase(slot)) {
            return false;
        }
        throw new BusinessValidationException("Slot de imagem inválido. Use 'principal' ou 'secundaria'.");
    }

    private Pista findEntityById(Long id) {
        return repository.findByIdOptional(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Pista não encontrada para o ID: " + id));
    }

    private void validarAnoLancamento(Integer anoLancamento) {
        if (anoLancamento == null) {
            return;
        }

        int anoAtual = Year.now().getValue();

        if (anoLancamento < PRIMEIRO_ANO_COLD_WHEELS || anoLancamento > anoAtual) {
            throw new BusinessValidationException(
                    "O ano de lançamento deve estar entre "
                            + PRIMEIRO_ANO_COLD_WHEELS
                            + " e "
                            + anoAtual
                            + ".");
        }
    }

    private void normalizarCamposTexto(Pista pista) {
        pista.setNome(normalizar(pista.getNome()));
        pista.setDescricao(normalizar(pista.getDescricao()));
        pista.setColecao(normalizar(pista.getColecao()));
    }

    private String normalizar(String valor) {
        return valor.trim();
    }

    private void vincularMarcaEFornecedor(Pista pista, Long idMarca, Long idFornecedor) {
        if (idMarca != null) {
            Marca marca = marcaRepository.findByIdOptional(idMarca)
                    .orElseThrow(() -> new ResourceNotFoundException("Marca não encontrada com id: " + idMarca));
            pista.setMarca(marca);
        } else {
            pista.setMarca(null);
        }

        if (idFornecedor != null) {
            Fornecedor fornecedor = fornecedorRepository.findByIdOptional(idFornecedor)
                    .orElseThrow(() -> new ResourceNotFoundException("Fornecedor não encontrado com id: " + idFornecedor));
            pista.setFornecedor(fornecedor);
        } else {
            pista.setFornecedor(null);
        }
    }
}