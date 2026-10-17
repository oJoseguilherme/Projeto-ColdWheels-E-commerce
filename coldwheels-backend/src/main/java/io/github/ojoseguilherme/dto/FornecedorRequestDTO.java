package io.github.ojoseguilherme.dto;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record FornecedorRequestDTO(
    @NotBlank(message = "A razão social é obrigatória")
    @Size(max = 150, message = "A razão social deve ter no máximo 150 caracteres")
    String razaoSocial,

    @NotBlank(message = "O nome fantasia é obrigatório")
    @Size(max = 120, message = "O nome fantasia deve ter no máximo 120 caracteres")
    String nomeFantasia,

    @NotBlank(message = "O CNPJ é obrigatório")
    @Size(max = 20, message = "O CNPJ deve ter no máximo 20 caracteres")
    String cnpj,

    @NotBlank(message = "O contato é obrigatório")
    String contatoNome,

    @NotBlank(message = "O e-mail é obrigatório")
    String email,

    @NotBlank(message = "O telefone é obrigatório")
    String telefone,

    @NotBlank(message = "A cidade é obrigatória")
    String cidade,

    @NotBlank(message = "A UF é obrigatória")
    @Size(max = 2, message = "A UF deve conter 2 caracteres")
    String uf,

    @NotNull(message = "O prazo de entrega é obrigatório")
    @Positive(message = "O prazo de entrega deve ser maior que zero")
    Integer prazoEntregaDias,

    @NotBlank(message = "O status é obrigatório")
    String status,

    List<String> marcasFornecidas
) {
}
