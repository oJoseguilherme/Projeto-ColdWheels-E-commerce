package io.github.ojoseguilherme.dto;

public record ItemEstoqueBaixoDTO(
    Long id,
    String nome,
    String tipo,
    Integer estoqueAtual,
    Integer estoqueMinimo,
    Double preco
) {
}
