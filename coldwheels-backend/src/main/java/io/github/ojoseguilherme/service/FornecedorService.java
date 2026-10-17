package io.github.ojoseguilherme.service;

import java.util.List;

import io.github.ojoseguilherme.dto.FornecedorRequestDTO;
import io.github.ojoseguilherme.dto.FornecedorResponseDTO;
import io.github.ojoseguilherme.dto.ResumoFornecedoresDTO;

public interface FornecedorService {

    List<FornecedorResponseDTO> findAll();

    FornecedorResponseDTO findById(Long id);

    FornecedorResponseDTO create(FornecedorRequestDTO dto);

    FornecedorResponseDTO update(Long id, FornecedorRequestDTO dto);

    void delete(Long id);

    ResumoFornecedoresDTO getResumo();
}
