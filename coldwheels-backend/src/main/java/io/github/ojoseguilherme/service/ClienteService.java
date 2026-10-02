package io.github.ojoseguilherme.service;

import java.util.List;

import io.github.ojoseguilherme.dto.ClienteRequestDTO;
import io.github.ojoseguilherme.dto.ClienteResponseDTO;
import io.github.ojoseguilherme.dto.ClienteResumoResponseDTO;

public interface ClienteService {

    List<ClienteResumoResponseDTO> findAll();

    ClienteResponseDTO findById(Long id);

    ClienteResponseDTO create(ClienteRequestDTO dto);

    ClienteResponseDTO update(Long id, ClienteRequestDTO dto);

    void delete(Long id);
}