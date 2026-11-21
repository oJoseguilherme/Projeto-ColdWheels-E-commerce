package io.github.ojoseguilherme.mapper;

import java.util.List;

import org.hibernate.Hibernate;

import io.github.ojoseguilherme.dto.FornecedorResponseDTO;
import io.github.ojoseguilherme.model.Fornecedor;
import io.github.ojoseguilherme.model.Marca;

public class FornecedorMapper {

    private FornecedorMapper() {
    }

    public static FornecedorResponseDTO toResponseDTO(Fornecedor fornecedor) {
        if (fornecedor == null) {
            return null;
        }

        List<String> marcasNomes = (fornecedor.getMarcasFornecidas() != null && Hibernate.isInitialized(fornecedor.getMarcasFornecidas()))
                ? fornecedor.getMarcasFornecidas().stream().map(Marca::getNome).toList()
                : List.of();

        return new FornecedorResponseDTO(
            fornecedor.getId(),
            fornecedor.getRazaoSocial(),
            fornecedor.getNomeFantasia(),
            fornecedor.getCnpj(),
            fornecedor.getContatoNome(),
            fornecedor.getEmail(),
            fornecedor.getTelefone(),
            fornecedor.getCep(),
            fornecedor.getCidade(),
            fornecedor.getUf(),
            fornecedor.getPrazoEntregaDias(),
            fornecedor.getStatus(),
            marcasNomes,
            0L,
            fornecedor.getDataCadastro()
        );
    }
}
