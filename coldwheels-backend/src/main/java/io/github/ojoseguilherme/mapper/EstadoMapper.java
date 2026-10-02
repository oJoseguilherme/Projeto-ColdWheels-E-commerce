package io.github.ojoseguilherme.mapper;

import io.github.ojoseguilherme.dto.EstadoResponseDTO;
import io.github.ojoseguilherme.model.Estado;

public final class EstadoMapper {

    private EstadoMapper() {
    }

    public static EstadoResponseDTO toResponseDTO(Estado estado) {
        return new EstadoResponseDTO(
            estado.getCodigoIbge(),
            estado.getNome(),
            estado.getSigla()
        );
    }
}