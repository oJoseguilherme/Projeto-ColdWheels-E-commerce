package io.github.ojoseguilherme.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record ClienteResponseDTO(
    Long id,
    String nome,
    String cpf,
    String email,
    LocalDate dataNascimento,
    String telefone,
    EnderecoResponseDTO endereco,
    LocalDateTime dataCadastro
) {
}