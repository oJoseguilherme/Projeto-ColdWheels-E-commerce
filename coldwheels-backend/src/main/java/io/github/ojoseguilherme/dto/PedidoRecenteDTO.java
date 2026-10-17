package io.github.ojoseguilherme.dto;

public record PedidoRecenteDTO(
    Long id,
    String numero,
    String clienteNome,
    String dataCompra,
    Integer totalItens,
    Double valorTotal,
    String status
) {
}
