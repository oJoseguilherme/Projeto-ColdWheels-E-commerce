package io.github.ojoseguilherme.dto;

import jakarta.validation.constraints.NotBlank;

public record StatusPedidoRequestDTO(
    @NotBlank(message = "O status é obrigatório")
    String status
) {
}
