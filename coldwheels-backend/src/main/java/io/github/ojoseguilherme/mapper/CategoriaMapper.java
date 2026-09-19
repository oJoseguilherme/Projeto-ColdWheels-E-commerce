package io.github.ojoseguilherme.mapper;

import io.github.ojoseguilherme.dto.CategoriaRequestDTO;
import io.github.ojoseguilherme.dto.CategoriaResponseDTO;
import io.github.ojoseguilherme.model.Categoria;

public class CategoriaMapper {

    public static Categoria toEntity(CategoriaRequestDTO dto) {
        if (dto == null) {
            return null;
        }

        Categoria categoria = new Categoria();
        categoria.setNome(dto.nome());
        categoria.setDescricao(dto.descricao());
        return categoria;
    }

    public static CategoriaResponseDTO toResponseDTO(Categoria categoria) {
        if (categoria == null) {
            return null;
        }

        return new CategoriaResponseDTO(
            categoria.getId(),
            categoria.getNome(),
            categoria.getDescricao(),
            categoria.getDataCadastro()
        );
    }
}
