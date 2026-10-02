package io.github.ojoseguilherme.dto;

import java.time.LocalDateTime;

public record ClienteResumoResponseDTO(
    Long id,
    String nome,
    String email,
    String municipio,
    String uf,
    LocalDateTime dataCadastro
) {
}