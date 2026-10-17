package io.github.ojoseguilherme.dto;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

public record PedidoRequestDTO(
    String numeroPedido,
    Long idCliente,
    @NotBlank String status,
    @NotEmpty List<ItemPedidoRequestDTO> itens
) {
}
