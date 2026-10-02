package io.github.ojoseguilherme.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoriaRequestDTO(
    @NotBlank(message = "O nome da categoria é obrigatório")
    @Size(max = 100, message = "O nome não pode exceder 100 caracteres")
    String nome,

    @Size(max = 255, message = "A descrição não pode exceder 255 caracteres")
    String descricao
) {
}
