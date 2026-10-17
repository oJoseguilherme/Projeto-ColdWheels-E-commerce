package io.github.ojoseguilherme.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record MarcaRequestDTO(
    @NotBlank(message = "O nome da marca é obrigatório")
    @Size(max = 100, message = "O nome deve ter no máximo 100 caracteres")
    String nome,

    @NotBlank(message = "O país de origem é obrigatório")
    @Size(max = 100, message = "O país de origem deve ter no máximo 100 caracteres")
    String paisOrigem,

    String bandeiraPais,
    String logoUrl,

    @NotBlank(message = "O status é obrigatório")
    String status
) {
}
