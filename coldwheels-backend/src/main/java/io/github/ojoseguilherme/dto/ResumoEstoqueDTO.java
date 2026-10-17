package io.github.ojoseguilherme.dto;

public record ResumoEstoqueDTO(
    long emEstoque,
    long estoqueBaixo,
    long esgotado
) {
}
