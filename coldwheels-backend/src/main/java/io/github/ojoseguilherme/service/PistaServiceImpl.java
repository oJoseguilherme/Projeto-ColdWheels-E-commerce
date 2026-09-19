package io.github.ojoseguilherme.service;

import java.time.Year;
import java.util.List;

import io.github.ojoseguilherme.dto.PistaRequestDTO;
import io.github.ojoseguilherme.dto.PistaResponseDTO;
import io.github.ojoseguilherme.exception.BusinessValidationException;
import io.github.ojoseguilherme.exception.DuplicateResourceException;
import io.github.ojoseguilherme.exception.ResourceNotFoundException;
import io.github.ojoseguilherme.mapper.PistaMapper;
import io.github.ojoseguilherme.model.Pista;
import io.github.ojoseguilherme.repository.PistaRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class PistaServiceImpl implements PistaService {

    private static final int PRIMEIRO_ANO_HOT_WHEELS = 1968;

    @Inject
    PistaRepository repository;

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

        return PistaMapper.toResponseDTO(pista);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Pista pista = findEntityById(id);
        repository.delete(pista);
    }

    private Pista findEntityById(Long id) {
        return repository.findByIdOptional(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Pista não encontrada para o ID: " + id));
    }

    private void validarAnoLancamento(Integer anoLancamento) {
        int anoAtual = Year.now().getValue();

        if (anoLancamento < PRIMEIRO_ANO_HOT_WHEELS || anoLancamento > anoAtual) {
            throw new BusinessValidationException(
                    "O ano de lançamento deve estar entre "
                            + PRIMEIRO_ANO_HOT_WHEELS
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
}