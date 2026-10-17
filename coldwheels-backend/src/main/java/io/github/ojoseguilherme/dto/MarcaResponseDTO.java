package io.github.ojoseguilherme.dto;

import java.time.LocalDateTime;

public record MarcaResponseDTO(
    Long id,
    String nome,
    String paisOrigem,
    String bandeiraPais,
    String logoUrl,
    String status,
    long totalProdutos,
    LocalDateTime dataCadastro
) {
}
