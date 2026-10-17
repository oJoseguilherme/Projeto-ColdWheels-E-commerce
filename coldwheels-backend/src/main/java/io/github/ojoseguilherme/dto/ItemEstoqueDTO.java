package io.github.ojoseguilherme.dto;

public record ItemEstoqueDTO(
    Long id,
    String nome,
    String tipo, // 'CARRINHO' ou 'PISTA'
    String codigoSku,
    Integer quantidade,
    Integer estoqueMinimo,
    String status, // 'EM_ESTOQUE', 'ESTOQUE_BAIXO', 'ESGOTADO'
    Double preco
) {
}
