package io.github.ojoseguilherme.service;

import java.util.List;

import io.github.ojoseguilherme.dto.MarcaRequestDTO;
import io.github.ojoseguilherme.dto.MarcaResponseDTO;
import io.github.ojoseguilherme.dto.ResumoMarcasDTO;

public interface MarcaService {

    List<MarcaResponseDTO> findAll();

    MarcaResponseDTO findById(Long id);

    MarcaResponseDTO create(MarcaRequestDTO dto);

    MarcaResponseDTO update(Long id, MarcaRequestDTO dto);

    void delete(Long id);

    ResumoMarcasDTO getResumo();
}
