package io.github.ojoseguilherme.mapper;

import io.github.ojoseguilherme.dto.CarrinhoRequestDTO;
import io.github.ojoseguilherme.dto.CarrinhoResponseDTO;
import io.github.ojoseguilherme.model.Carrinho;
import io.github.ojoseguilherme.model.Categoria;
import io.github.ojoseguilherme.model.Fornecedor;
import io.github.ojoseguilherme.model.Marca;

public class CarrinhoMapper {

    public static Carrinho toEntity(CarrinhoRequestDTO dto) {
        if (dto == null) {
            return null;
        }

        Carrinho carrinho = new Carrinho();
        carrinho.setNome(dto.nome());
        carrinho.setDescricao(dto.descricao());
        carrinho.setEscala(dto.escala());
        carrinho.setAnoLancamento(dto.anoLancamento());
        carrinho.setCor(dto.cor());
        carrinho.setPreco(dto.preco());
        carrinho.setEstoque(dto.estoque());

        if (dto.idCategoria() != null) {
            Categoria categoria = new Categoria();
            categoria.setId(dto.idCategoria());
            carrinho.setCategoria(categoria);
        }

        if (dto.idMarca() != null) {
            Marca marca = new Marca();
            marca.setId(dto.idMarca());
            carrinho.setMarca(marca);
        }

        if (dto.idFornecedor() != null) {
            Fornecedor fornecedor = new Fornecedor();
            fornecedor.setId(dto.idFornecedor());
            carrinho.setFornecedor(fornecedor);
        }

        return carrinho;
    }

    public static CarrinhoResponseDTO toResponseDTO(Carrinho carrinho) {
        if (carrinho == null) {
            return null;
        }

        return new CarrinhoResponseDTO(
            carrinho.getId(),
            carrinho.getNome(),
            carrinho.getDescricao(),
            carrinho.getEscala(),
            carrinho.getAnoLancamento(),
            carrinho.getCor(),
            carrinho.getPreco(),
            carrinho.getEstoque(),
            CategoriaMapper.toResponseDTO(carrinho.getCategoria()),
            MarcaMapper.toResponseDTO(carrinho.getMarca()),
            FornecedorMapper.toResponseDTO(carrinho.getFornecedor()),
            carrinho.getImagemPrincipal() != null ? "/arquivos/" + carrinho.getImagemPrincipal().getId() : null,
            carrinho.getImagemSecundaria() != null ? "/arquivos/" + carrinho.getImagemSecundaria().getId() : null,
            carrinho.getDataCadastro()
        );
    }
}
