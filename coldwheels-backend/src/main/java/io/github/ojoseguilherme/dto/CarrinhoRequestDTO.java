package io.github.ojoseguilherme.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

public record CarrinhoRequestDTO(
    @NotBlank(message= "O nome é obrigatório")
    String nome,


    String descricao,

    @NotBlank (message="A escala é obrigatória (ex: 1:64)")
    String escala,

    @NotNull ( message ="O ano de lançamento é obrigatório")
    Integer anoLancamento,

     @NotBlank(message= "A cor é obrigatória ")
    String cor,

    
    @NotNull ( message ="O preço é obrigatório")
    @Positive (message="O preço deve ser maior que zero")
    Double preco,

    @NotNull (message="O estoque é obrigatório")
    @PositiveOrZero (message = "O estoque não pode ser negativo")
    Integer estoque


) {


    
}
