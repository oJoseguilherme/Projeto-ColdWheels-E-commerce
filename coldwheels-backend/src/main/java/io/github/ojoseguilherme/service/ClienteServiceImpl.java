package io.github.ojoseguilherme.service;

import java.util.List;
import java.util.Locale;

import io.github.ojoseguilherme.dto.ClienteRequestDTO;
import io.github.ojoseguilherme.dto.ClienteResponseDTO;
import io.github.ojoseguilherme.dto.ClienteResumoResponseDTO;
import io.github.ojoseguilherme.dto.EnderecoRequestDTO;
import io.github.ojoseguilherme.exception.BusinessValidationException;
import io.github.ojoseguilherme.exception.DuplicateResourceException;
import io.github.ojoseguilherme.exception.ResourceNotFoundException;
import io.github.ojoseguilherme.mapper.ClienteMapper;
import io.github.ojoseguilherme.model.Cliente;
import io.github.ojoseguilherme.model.Municipio;
import io.github.ojoseguilherme.model.Pessoa;
import io.github.ojoseguilherme.repository.ClienteRepository;
import io.github.ojoseguilherme.repository.MunicipioRepository;
import io.github.ojoseguilherme.repository.PessoaRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class ClienteServiceImpl implements ClienteService {

    @Inject
    ClienteRepository clienteRepository;

    @Inject
    PessoaRepository pessoaRepository;

    @Inject
    MunicipioRepository municipioRepository;

    @Override
    @Transactional
    public List<ClienteResumoResponseDTO> findAll() {
        return clienteRepository.listAllWithDetails()
                .stream()
                .map(ClienteMapper::toResumoResponseDTO)
                .toList();
    }

    @Override
    @Transactional
    public ClienteResponseDTO findById(Long id) {
        return ClienteMapper.toResponseDTO(findEntityById(id));
    }

    @Override
    @Transactional
    public ClienteResponseDTO create(ClienteRequestDTO dto) {
        ClienteRequestDTO normalizado = normalizar(dto);

        validarNomeNormalizado(normalizado.nome());
        validarDuplicidadeCadastro(normalizado);

        Municipio municipio = findMunicipio(
                normalizado.endereco().codigoIbgeMunicipio());

        Cliente cliente = ClienteMapper.toEntity(
                normalizado,
                municipio);

        pessoaRepository.persist(cliente.getPessoa());
        clienteRepository.persist(cliente);

        return ClienteMapper.toResponseDTO(cliente);
    }

    @Override
    @Transactional
    public ClienteResponseDTO update(
            Long id,
            ClienteRequestDTO dto) {

        Cliente cliente = findEntityById(id);
        Pessoa pessoa = cliente.getPessoa();

        ClienteRequestDTO normalizado = normalizar(dto);

        validarNomeNormalizado(normalizado.nome());
        validarDuplicidadeEdicao(normalizado, pessoa.getId());

        Municipio municipio = findMunicipio(
                normalizado.endereco().codigoIbgeMunicipio());

        ClienteMapper.updateEntity(
                cliente,
                normalizado,
                municipio);

        return ClienteMapper.toResponseDTO(cliente);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Cliente cliente = findEntityById(id);
        Pessoa pessoa = cliente.getPessoa();

        clienteRepository.delete(cliente);

        /*
         * Cliente não possui cascade REMOVE para Pessoa.
         * A exclusão é intencional e explícita para evitar que o
         * relacionamento controle inadvertidamente o ciclo de vida
         * dos dados pessoais.
         */
        clienteRepository.flush();

        pessoaRepository.delete(pessoa);
    }

    private Cliente findEntityById(Long id) {
        return clienteRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Cliente não encontrado para o ID: " + id));
    }

    private Municipio findMunicipio(String codigoIbge) {
        return municipioRepository.findByCodigoIbge(codigoIbge)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Município informado não foi encontrado."));
    }

    private void validarDuplicidadeCadastro(
            ClienteRequestDTO dto) {

        if (pessoaRepository.existsByCpf(dto.cpf())) {
            throw new DuplicateResourceException(
                    "Já existe uma pessoa cadastrada com este CPF.");
        }

        if (pessoaRepository.existsByEmailIgnoreCase(dto.email())) {
            throw new DuplicateResourceException(
                    "Já existe uma pessoa cadastrada com este e-mail.");
        }
    }

    private void validarDuplicidadeEdicao(
            ClienteRequestDTO dto,
            Long pessoaId) {

        if (pessoaRepository.existsByCpfAndIdNot(
                dto.cpf(),
                pessoaId)) {

            throw new DuplicateResourceException(
                    "Já existe outra pessoa cadastrada com este CPF.");
        }

        if (pessoaRepository.existsByEmailIgnoreCaseAndIdNot(
                dto.email(),
                pessoaId)) {

            throw new DuplicateResourceException(
                    "Já existe outra pessoa cadastrada com este e-mail.");
        }
    }

    private void validarNomeNormalizado(String nome) {
        if (nome.length() < 2) {
            throw new BusinessValidationException(
                    "O nome deve ter pelo menos 2 caracteres válidos.");
        }
    }

    private ClienteRequestDTO normalizar(
            ClienteRequestDTO dto) {

        EnderecoRequestDTO endereco = dto.endereco();

        EnderecoRequestDTO enderecoNormalizado =
                new EnderecoRequestDTO(
                        normalizarObrigatorio(endereco.cep()),
                        normalizarObrigatorio(endereco.logradouro()),
                        normalizarObrigatorio(endereco.numero()),
                        normalizarOpcional(endereco.complemento()),
                        normalizarObrigatorio(endereco.bairro()),
                        normalizarObrigatorio(
                                endereco.codigoIbgeMunicipio())
                );

        return new ClienteRequestDTO(
                normalizarObrigatorio(dto.nome()),
                normalizarObrigatorio(dto.cpf()),
                normalizarEmail(dto.email()),
                dto.dataNascimento(),
                normalizarOpcional(dto.telefone()),
                enderecoNormalizado
        );
    }

    private String normalizarEmail(String email) {
        return normalizarObrigatorio(email)
                .toLowerCase(Locale.ROOT);
    }

    private String normalizarObrigatorio(String valor) {
        return valor.trim();
    }

    private String normalizarOpcional(String valor) {
        if (valor == null) {
            return null;
        }

        String normalizado = valor.trim();

        return normalizado.isEmpty()
                ? null
                : normalizado;
    }
}