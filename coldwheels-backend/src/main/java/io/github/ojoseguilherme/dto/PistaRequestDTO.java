package io.github.ojoseguilherme.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record PistaRequestDTO(

    @NotBlank(message = "O nome é obrigatório")
    @Size(max = 120, message = "O nome deve ter no máximo 120 caracteres")
    String nome,

    @NotBlank(message = "A descrição é obrigatória")
    @Size(max = 500, message = "A descrição deve ter no máximo 500 caracteres")
    String descricao,

    @NotNull(message = "O preço é obrigatório")
    @Positive(message = "O preço deve ser maior que zero")
    @Digits(integer = 8, fraction = 2, message = "O preço deve possuir no máximo 8 dígitos inteiros e 2 casas decimais")
    BigDecimal preco,

    @NotNull(message = "O ano de lançamento é obrigatório")
    Integer anoLancamento,

    @NotNull(message = "A quantidade de peças é obrigatória")
    @Positive(message = "A quantidade de peças deve ser maior que zero")
    Integer quantidadePecas,

    @NotNull(message = "A idade mínima é obrigatória")
    @Positive(message = "A idade mínima deve ser maior que zero")
    Integer idadeMinima,

    @NotBlank(message = "A coleção é obrigatória")
    @Size(max = 100, message = "A coleção deve ter no máximo 100 caracteres")
    String colecao,

    @NotNull(message = "O estoque é obrigatório")
    @PositiveOrZero(message = "O estoque não pode ser negativo")
    Integer estoque

) {
}