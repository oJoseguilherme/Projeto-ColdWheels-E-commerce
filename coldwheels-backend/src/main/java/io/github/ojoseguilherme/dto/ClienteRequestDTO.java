package io.github.ojoseguilherme.dto;

import java.time.LocalDate;

import org.hibernate.validator.constraints.br.CPF;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ClienteRequestDTO(

    @NotBlank(message = "O nome é obrigatório")
    @Size(
        min = 2,
        max = 120,
        message = "O nome deve ter entre 2 e 120 caracteres"
    )
    String nome,

    @NotBlank(message = "O CPF é obrigatório")
    @Pattern(
        regexp = "\\d{11}",
        message = "O CPF deve conter exatamente 11 dígitos"
    )
    @CPF(message = "O CPF informado é inválido")
    String cpf,

    @NotBlank(message = "O e-mail é obrigatório")
    @Email(message = "O e-mail deve possuir um formato válido")
    @Size(
        max = 254,
        message = "O e-mail deve ter no máximo 254 caracteres"
    )
    String email,

    @PastOrPresent(
        message = "A data de nascimento não pode estar no futuro"
    )
    LocalDate dataNascimento,

    @Pattern(
        regexp = "\\d{10,11}",
        message = "O telefone deve conter 10 ou 11 dígitos"
    )
    String telefone,

    @NotNull(message = "O endereço é obrigatório")
    @Valid
    EnderecoRequestDTO endereco

) {
}