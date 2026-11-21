package io.github.ojoseguilherme.mapper;

import io.github.ojoseguilherme.dto.MarcaResponseDTO;
import io.github.ojoseguilherme.model.Marca;

public class MarcaMapper {

    private MarcaMapper() {
    }

    public static MarcaResponseDTO toResponseDTO(Marca marca) {
        if (marca == null) {
            return null;
        }

        return new MarcaResponseDTO(
            marca.getId(),
            marca.getNome(),
            marca.getPaisOrigem(),
            marca.getBandeiraPais(),
            marca.getLogoUrl(),
            marca.getStatus(),
            0L,
            marca.getDataCadastro()
        );
    }
}
