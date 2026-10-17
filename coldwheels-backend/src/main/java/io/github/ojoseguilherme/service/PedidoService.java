package io.github.ojoseguilherme.service;

import java.util.List;

import io.github.ojoseguilherme.dto.PedidoRequestDTO;
import io.github.ojoseguilherme.dto.PedidoResponseDTO;
import io.github.ojoseguilherme.dto.StatusPedidoRequestDTO;

public interface PedidoService {

    List<PedidoResponseDTO> listarTodos(String termo, String status);

    PedidoResponseDTO buscarPorId(Long id);

    PedidoResponseDTO criar(PedidoRequestDTO dto);

    PedidoResponseDTO atualizarStatus(Long id, StatusPedidoRequestDTO dto);
}
