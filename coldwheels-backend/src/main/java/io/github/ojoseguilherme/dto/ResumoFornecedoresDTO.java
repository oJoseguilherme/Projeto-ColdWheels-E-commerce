package io.github.ojoseguilherme.dto;

public record ResumoFornecedoresDTO(
    long totalFornecedores,
    long totalAtivos,
    long totalPolos,
    long prazoMedioDias
) {
}
