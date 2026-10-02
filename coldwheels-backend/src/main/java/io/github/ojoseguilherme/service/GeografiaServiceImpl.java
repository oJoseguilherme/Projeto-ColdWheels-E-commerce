package io.github.ojoseguilherme.service;

import java.util.List;
import java.util.Locale;

import io.github.ojoseguilherme.dto.EstadoResponseDTO;
import io.github.ojoseguilherme.dto.MunicipioResponseDTO;
import io.github.ojoseguilherme.exception.BusinessValidationException;
import io.github.ojoseguilherme.exception.ResourceNotFoundException;
import io.github.ojoseguilherme.mapper.EstadoMapper;
import io.github.ojoseguilherme.mapper.MunicipioMapper;
import io.github.ojoseguilherme.model.Estado;
import io.github.ojoseguilherme.repository.EstadoRepository;
import io.github.ojoseguilherme.repository.MunicipioRepository;
import io.quarkus.panache.common.Sort;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class GeografiaServiceImpl implements GeografiaService {

    @Inject
    EstadoRepository estadoRepository;

    @Inject
    MunicipioRepository municipioRepository;

    @Override
    @Transactional
    public List<EstadoResponseDTO> findEstados() {
        return estadoRepository.findAll(Sort.by("nome"))
                .list()
                .stream()
                .map(EstadoMapper::toResponseDTO)
                .toList();
    }

    @Override
    @Transactional
    public List<MunicipioResponseDTO> findMunicipiosByUf(String uf) {
        String ufNormalizada = normalizarUf(uf);

        Estado estado = estadoRepository.findBySigla(ufNormalizada)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Estado informado não foi encontrado."
                ));

        return municipioRepository.listByEstado(estado)
                .stream()
                .map(MunicipioMapper::toResponseDTO)
                .toList();
    }

    @Override
    @Transactional
    public MunicipioResponseDTO findMunicipioByCodigoIbge(
            String codigoIbge) {

        String codigoNormalizado = normalizarCodigoIbge(codigoIbge);

        return municipioRepository
                .findByCodigoIbge(codigoNormalizado)
                .map(MunicipioMapper::toResponseDTO)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Município informado não foi encontrado."
                ));
    }

    private String normalizarUf(String uf) {
        if (uf == null) {
            throw new BusinessValidationException(
                    "A UF é obrigatória."
            );
        }

        String normalizada = uf.trim().toUpperCase(Locale.ROOT);

        if (!normalizada.matches("[A-Z]{2}")) {
            throw new BusinessValidationException(
                    "A UF deve conter exatamente 2 letras."
            );
        }

        return normalizada;
    }

    private String normalizarCodigoIbge(String codigoIbge) {
        if (codigoIbge == null) {
            throw new BusinessValidationException(
                    "O código IBGE do município é obrigatório."
            );
        }

        String normalizado = codigoIbge.trim();

        if (!normalizado.matches("\\d{7}")) {
            throw new BusinessValidationException(
                    "O código IBGE do município deve conter 7 dígitos."
            );
        }

        return normalizado;
    }
}