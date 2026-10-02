package io.github.ojoseguilherme.dto;

public record MunicipioResponseDTO(
    String codigoIbge,
    String nome,
    EstadoResponseDTO estado
) {
}