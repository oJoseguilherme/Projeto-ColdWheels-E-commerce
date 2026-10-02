package io.github.ojoseguilherme.mapper;

import io.github.ojoseguilherme.dto.EnderecoRequestDTO;
import io.github.ojoseguilherme.dto.EnderecoResponseDTO;
import io.github.ojoseguilherme.model.Endereco;
import io.github.ojoseguilherme.model.Municipio;

public final class EnderecoMapper {

    private EnderecoMapper() {
    }

    public static Endereco toEntity(
            EnderecoRequestDTO dto,
            Municipio municipio) {

        Endereco endereco = new Endereco();

        endereco.setCep(dto.cep());
        endereco.setLogradouro(dto.logradouro());
        endereco.setNumero(dto.numero());
        endereco.setComplemento(dto.complemento());
        endereco.setBairro(dto.bairro());
        endereco.setMunicipio(municipio);

        return endereco;
    }

    public static EnderecoResponseDTO toResponseDTO(Endereco endereco) {
        return new EnderecoResponseDTO(
            endereco.getCep(),
            endereco.getLogradouro(),
            endereco.getNumero(),
            endereco.getComplemento(),
            endereco.getBairro(),
            MunicipioMapper.toResponseDTO(endereco.getMunicipio())
        );
    }

    public static void updateEntity(
            Endereco endereco,
            EnderecoRequestDTO dto,
            Municipio municipio) {

        endereco.setCep(dto.cep());
        endereco.setLogradouro(dto.logradouro());
        endereco.setNumero(dto.numero());
        endereco.setComplemento(dto.complemento());
        endereco.setBairro(dto.bairro());
        endereco.setMunicipio(municipio);
    }
}