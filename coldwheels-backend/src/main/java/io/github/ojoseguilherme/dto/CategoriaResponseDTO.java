package io.github.ojoseguilherme.dto;

import java.time.LocalDateTime;

public record CategoriaResponseDTO(
    Long id,
    String nome,
    String descricao,
    LocalDateTime dataCadastro
) {
}
