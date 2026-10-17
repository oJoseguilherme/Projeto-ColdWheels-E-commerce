package io.github.ojoseguilherme.dto;

import jakarta.validation.constraints.NotNull;

public record AjusteEstoqueRequestDTO(
    @NotNull(message = "O delta de ajuste é obrigatório")
    Integer delta
) {
}
