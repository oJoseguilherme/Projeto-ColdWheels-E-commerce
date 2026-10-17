package io.github.ojoseguilherme.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record ItemPedidoRequestDTO(
    String tipoProduto, // 'CARRINHO' ou 'PISTA'
    Long idProduto,
    @NotNull @Positive Integer quantidade,
    @NotNull @Positive BigDecimal precoUnitario
) {
}
