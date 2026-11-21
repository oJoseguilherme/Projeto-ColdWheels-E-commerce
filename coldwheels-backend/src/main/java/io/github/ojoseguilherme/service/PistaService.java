package io.github.ojoseguilherme.service;

import java.util.List;

import io.github.ojoseguilherme.dto.PistaRequestDTO;
import io.github.ojoseguilherme.dto.PistaResponseDTO;

public interface PistaService {

    List<PistaResponseDTO> findAll();

    PistaResponseDTO findById(Long id);

    PistaResponseDTO create(PistaRequestDTO dto);

    PistaResponseDTO update(Long id, PistaRequestDTO dto);

    void delete(Long id);

    PistaResponseDTO atualizarImagem(Long id, String slot, String nomeOriginal, String contentType, byte[] conteudo);

    PistaResponseDTO removerImagem(Long id, String slot);
}