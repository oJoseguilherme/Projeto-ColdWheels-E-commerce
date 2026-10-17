package io.github.ojoseguilherme.dto;

public record ItemPedidoResponseDTO(
    Long id,
    String tipoProduto,
    Long idProduto,
    String nomeProduto,
    Integer quantidade,
    Double precoUnitario,
    Double subtotal
) {
}
