package io.github.ojoseguilherme.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PistaResponseDTO(

    Long id,
    String nome,
    String descricao,
    BigDecimal preco,
    Integer anoLancamento,
    Integer quantidadePecas,
    Integer idadeMinima,
    String colecao,
    Integer estoque,
    LocalDateTime dataCadastro

) {
}