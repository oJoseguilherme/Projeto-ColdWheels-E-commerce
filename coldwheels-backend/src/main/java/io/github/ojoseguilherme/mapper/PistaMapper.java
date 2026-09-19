package io.github.ojoseguilherme.mapper;

import io.github.ojoseguilherme.dto.PistaRequestDTO;
import io.github.ojoseguilherme.dto.PistaResponseDTO;
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
    }
}