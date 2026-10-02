package io.github.ojoseguilherme.mapper;

import io.github.ojoseguilherme.dto.MunicipioResponseDTO;
import io.github.ojoseguilherme.model.Municipio;

public final class MunicipioMapper {

    private MunicipioMapper() {
    }

    public static MunicipioResponseDTO toResponseDTO(Municipio municipio) {
        return new MunicipioResponseDTO(
            municipio.getCodigoIbge(),
            municipio.getNome(),
            EstadoMapper.toResponseDTO(municipio.getEstado())
        );
    }
}