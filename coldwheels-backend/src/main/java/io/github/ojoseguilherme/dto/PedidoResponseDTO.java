package io.github.ojoseguilherme.dto;

import java.util.List;

public record PedidoResponseDTO(
    Long id,
    String numeroPedido,
    String nomeCliente,
    String emailCliente,
    String dataCompra,
    Integer itensTotais,
    Double quantiaTotal,
    String status,
    List<ItemPedidoResponseDTO> itens
) {
}
