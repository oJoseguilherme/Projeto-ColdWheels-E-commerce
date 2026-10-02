package io.github.ojoseguilherme.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record EnderecoRequestDTO(

    @NotBlank(message = "O CEP é obrigatório")
    @Pattern(
        regexp = "\\d{8}",
        message = "O CEP deve conter exatamente 8 dígitos"
    )
    String cep,

    @NotBlank(message = "O logradouro é obrigatório")
    @Size(
        max = 150,
        message = "O logradouro deve ter no máximo 150 caracteres"
    )
    String logradouro,

    @NotBlank(message = "O número é obrigatório")
    @Size(
        max = 30,
        message = "O número deve ter no máximo 30 caracteres"
    )
    String numero,

    @Size(
        max = 120,
        message = "O complemento deve ter no máximo 120 caracteres"
    )
    String complemento,

    @NotBlank(message = "O bairro é obrigatório")
    @Size(
        max = 120,
        message = "O bairro deve ter no máximo 120 caracteres"
    )
    String bairro,

    @NotBlank(message = "O município é obrigatório")
    @Pattern(
        regexp = "\\d{7}",
        message = "O código IBGE do município deve conter 7 dígitos"
    )
    String codigoIbgeMunicipio

) {
}