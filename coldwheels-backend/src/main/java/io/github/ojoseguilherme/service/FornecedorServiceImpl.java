package io.github.ojoseguilherme.service;

import java.util.ArrayList;
import java.util.List;

import io.github.ojoseguilherme.dto.FornecedorRequestDTO;
import io.github.ojoseguilherme.dto.FornecedorResponseDTO;
import io.github.ojoseguilherme.dto.ResumoFornecedoresDTO;
import io.github.ojoseguilherme.exception.DuplicateResourceException;
import io.github.ojoseguilherme.exception.ResourceNotFoundException;
import io.github.ojoseguilherme.model.Fornecedor;
import io.github.ojoseguilherme.model.Marca;
import io.github.ojoseguilherme.repository.FornecedorRepository;
import io.github.ojoseguilherme.repository.MarcaRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class FornecedorServiceImpl implements FornecedorService {

    @Inject
    FornecedorRepository fornecedorRepository;

    @Inject
    MarcaRepository marcaRepository;

    @Override
    @Transactional
    public List<FornecedorResponseDTO> findAll() {
        return fornecedorRepository.listAll().stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Override
    @Transactional
    public FornecedorResponseDTO findById(Long id) {
        Fornecedor fornecedor = fornecedorRepository.findByIdOptional(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fornecedor não encontrado com id: " + id));
        return toResponseDTO(fornecedor);
    }

    @Override
    @Transactional
    public FornecedorResponseDTO create(FornecedorRequestDTO dto) {
        if (fornecedorRepository.findByCnpj(dto.cnpj()).isPresent()) {
            throw new DuplicateResourceException("Já existe um fornecedor cadastrado com o CNPJ: " + dto.cnpj());
        }

        Fornecedor fornecedor = new Fornecedor();
        mapearDados(fornecedor, dto);

        fornecedorRepository.persist(fornecedor);
        return toResponseDTO(fornecedor);
    }

    @Override
    @Transactional
    public FornecedorResponseDTO update(Long id, FornecedorRequestDTO dto) {
        Fornecedor fornecedor = fornecedorRepository.findByIdOptional(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fornecedor não encontrado com id: " + id));

        fornecedorRepository.findByCnpj(dto.cnpj())
                .filter(f -> !f.getId().equals(id))
                .ifPresent(f -> {
                    throw new DuplicateResourceException("Já existe outro fornecedor com o CNPJ: " + dto.cnpj());
                });

        mapearDados(fornecedor, dto);
        return toResponseDTO(fornecedor);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Fornecedor fornecedor = fornecedorRepository.findByIdOptional(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fornecedor não encontrado com id: " + id));
        fornecedorRepository.delete(fornecedor);
    }

    @Override
    @Transactional
    public ResumoFornecedoresDTO getResumo() {
        List<Fornecedor> todos = fornecedorRepository.listAll();
        long totalFornecedores = todos.size();
        long totalAtivos = todos.stream().filter(f -> "ATIVO".equalsIgnoreCase(f.getStatus())).count();
        long totalPolos = todos.stream().map(Fornecedor::getUf).distinct().count();
        long somaPrazos = todos.stream().mapToLong(Fornecedor::getPrazoEntregaDias).sum();
        long prazoMedioDias = totalFornecedores > 0 ? Math.round((double) somaPrazos / totalFornecedores) : 0;

        return new ResumoFornecedoresDTO(totalFornecedores, totalAtivos, totalPolos, prazoMedioDias);
    }

    private void mapearDados(Fornecedor fornecedor, FornecedorRequestDTO dto) {
        fornecedor.setRazaoSocial(dto.razaoSocial().trim());
        fornecedor.setNomeFantasia(dto.nomeFantasia().trim());
        fornecedor.setCnpj(dto.cnpj().trim());
        fornecedor.setContatoNome(dto.contatoNome().trim());
        fornecedor.setEmail(dto.email().trim());
        fornecedor.setTelefone(dto.telefone().trim());
        fornecedor.setCidade(dto.cidade().trim());
        fornecedor.setUf(dto.uf().trim().toUpperCase());
        fornecedor.setPrazoEntregaDias(dto.prazoEntregaDias());
        fornecedor.setStatus(dto.status().trim());

        List<Marca> marcas = new ArrayList<>();
        if (dto.marcasFornecidas() != null && !dto.marcasFornecidas().isEmpty()) {
            for (String nomeMarca : dto.marcasFornecidas()) {
                marcaRepository.findByNome(nomeMarca).ifPresent(marcas::add);
            }
        }
        fornecedor.setMarcasFornecidas(marcas);
    }

    private FornecedorResponseDTO toResponseDTO(Fornecedor fornecedor) {
        List<String> marcasNomes = fornecedor.getMarcasFornecidas().stream()
                .map(Marca::getNome)
                .toList();

        return new FornecedorResponseDTO(
            fornecedor.getId(),
            fornecedor.getRazaoSocial(),
            fornecedor.getNomeFantasia(),
            fornecedor.getCnpj(),
            fornecedor.getContatoNome(),
            fornecedor.getEmail(),
            fornecedor.getTelefone(),
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
