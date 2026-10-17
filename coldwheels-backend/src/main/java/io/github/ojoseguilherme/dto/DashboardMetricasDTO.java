package io.github.ojoseguilherme.dto;

public record DashboardMetricasDTO(
    Double vendasTotais,
    Long totalUsuarios,
    Long totalPedidos,
    Long estoqueBaixoCount
) {
}
