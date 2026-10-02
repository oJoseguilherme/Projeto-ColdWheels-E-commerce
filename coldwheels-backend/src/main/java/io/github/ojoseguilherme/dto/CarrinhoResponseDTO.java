package io.github.ojoseguilherme.dto;

import java.time.LocalDateTime;

public record CarrinhoResponseDTO(
    Long id,
    String nome,
    String descricao,
    String escala,
    Integer anoLancamento,
    String cor,
    Double preco,
    Integer estoque,
    CategoriaResponseDTO categoria,
    LocalDateTime dataCadastro
) {

}
