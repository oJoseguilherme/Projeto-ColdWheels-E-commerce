package io.github.ojoseguilherme.mapper;

import io.github.ojoseguilherme.dto.ClienteRequestDTO;
import io.github.ojoseguilherme.dto.ClienteResponseDTO;
import io.github.ojoseguilherme.dto.ClienteResumoResponseDTO;
import io.github.ojoseguilherme.model.Cliente;
import io.github.ojoseguilherme.model.Municipio;
import io.github.ojoseguilherme.model.Pessoa;

public final class ClienteMapper {

    private ClienteMapper() {
    }

    public static Cliente toEntity(
            ClienteRequestDTO dto,
            Municipio municipio) {

        Pessoa pessoa = new Pessoa();

        pessoa.setNome(dto.nome());
        pessoa.setCpf(dto.cpf());
        pessoa.setEmail(dto.email());
        pessoa.setDataNascimento(dto.dataNascimento());
        pessoa.setTelefone(dto.telefone());
        pessoa.setEndereco(
            EnderecoMapper.toEntity(dto.endereco(), municipio)
        );

        Cliente cliente = new Cliente();
        cliente.setPessoa(pessoa);

        return cliente;
    }

    public static ClienteResponseDTO toResponseDTO(Cliente cliente) {
        Pessoa pessoa = cliente.getPessoa();

        return new ClienteResponseDTO(
            cliente.getId(),
            pessoa.getNome(),
            pessoa.getCpf(),
            pessoa.getEmail(),
            pessoa.getDataNascimento(),
            pessoa.getTelefone(),
            EnderecoMapper.toResponseDTO(pessoa.getEndereco()),
            cliente.getDataCadastro()
        );
    }

    public static ClienteResumoResponseDTO toResumoResponseDTO(
            Cliente cliente) {

        Pessoa pessoa = cliente.getPessoa();
        Municipio municipio = pessoa.getEndereco().getMunicipio();

        return new ClienteResumoResponseDTO(
            cliente.getId(),
            pessoa.getNome(),
            pessoa.getEmail(),
            municipio.getNome(),
            municipio.getEstado().getSigla(),
            cliente.getDataCadastro()
        );
    }

    public static void updateEntity(
            Cliente cliente,
            ClienteRequestDTO dto,
            Municipio municipio) {

        Pessoa pessoa = cliente.getPessoa();

        pessoa.setNome(dto.nome());
        pessoa.setCpf(dto.cpf());
        pessoa.setEmail(dto.email());
        pessoa.setDataNascimento(dto.dataNascimento());
        pessoa.setTelefone(dto.telefone());

        EnderecoMapper.updateEntity(
            pessoa.getEndereco(),
            dto.endereco(),
            municipio
        );
    }
}