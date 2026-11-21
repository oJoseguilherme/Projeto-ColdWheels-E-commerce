package io.github.ojoseguilherme.mapper;

import io.github.ojoseguilherme.dto.PistaRequestDTO;
import io.github.ojoseguilherme.dto.PistaResponseDTO;
import io.github.ojoseguilherme.model.Fornecedor;
import io.github.ojoseguilherme.model.Marca;
import io.github.ojoseguilherme.model.Pista;

public class PistaMapper {

    private PistaMapper() {
    }

    public static Pista toEntity(PistaRequestDTO dto) {
        Pista pista = new Pista();

        pista.setNome(dto.nome());
        pista.setDescricao(dto.descricao());
        pista.setPreco(dto.preco());
        pista.setAnoLancamento(dto.anoLancamento());
        pista.setQuantidadePecas(dto.quantidadePecas());
        pista.setIdadeMinima(dto.idadeMinima());
        pista.setColecao(dto.colecao());
        pista.setEstoque(dto.estoque());

        if (dto.idMarca() != null) {
            Marca marca = new Marca();
            marca.setId(dto.idMarca());
            pista.setMarca(marca);
        }

        if (dto.idFornecedor() != null) {
            Fornecedor fornecedor = new Fornecedor();
            fornecedor.setId(dto.idFornecedor());
            pista.setFornecedor(fornecedor);
        }

        return pista;
    }

    public static PistaResponseDTO toResponseDTO(Pista pista) {
        return new PistaResponseDTO(
            pista.getId(),
            pista.getNome(),
            pista.getDescricao(),
            pista.getPreco(),
            pista.getAnoLancamento(),
            pista.getQuantidadePecas(),
            pista.getIdadeMinima(),
            pista.getColecao(),
            pista.getEstoque(),
            MarcaMapper.toResponseDTO(pista.getMarca()),
            FornecedorMapper.toResponseDTO(pista.getFornecedor()),
            pista.getImagemPrincipal() != null ? "/arquivos/" + pista.getImagemPrincipal().getId() : null,
            pista.getImagemSecundaria() != null ? "/arquivos/" + pista.getImagemSecundaria().getId() : null,
            pista.getDataCadastro()
        );
    }

    public static void updateEntity(Pista pista, PistaRequestDTO dto) {
        pista.setNome(dto.nome());
        pista.setDescricao(dto.descricao());
        pista.setPreco(dto.preco());
        pista.setAnoLancamento(dto.anoLancamento());
        pista.setQuantidadePecas(dto.quantidadePecas());
        pista.setIdadeMinima(dto.idadeMinima());
        pista.setColecao(dto.colecao());
        pista.setEstoque(dto.estoque());

        if (dto.idMarca() != null) {
            Marca marca = new Marca();
            marca.setId(dto.idMarca());
            pista.setMarca(marca);
        } else {
            pista.setMarca(null);
        }

        if (dto.idFornecedor() != null) {
            Fornecedor fornecedor = new Fornecedor();
            fornecedor.setId(dto.idFornecedor());
            pista.setFornecedor(fornecedor);
        } else {
            pista.setFornecedor(null);
        }
    }
}