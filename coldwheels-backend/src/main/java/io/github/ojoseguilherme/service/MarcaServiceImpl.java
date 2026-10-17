package io.github.ojoseguilherme.service;

import java.util.List;

import io.github.ojoseguilherme.dto.MarcaRequestDTO;
import io.github.ojoseguilherme.dto.MarcaResponseDTO;
import io.github.ojoseguilherme.dto.ResumoMarcasDTO;
import io.github.ojoseguilherme.exception.DuplicateResourceException;
import io.github.ojoseguilherme.exception.ResourceNotFoundException;
import io.github.ojoseguilherme.model.Marca;
import io.github.ojoseguilherme.repository.CarrinhoRepository;
import io.github.ojoseguilherme.repository.MarcaRepository;
import io.github.ojoseguilherme.repository.PistaRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class MarcaServiceImpl implements MarcaService {

    @Inject
    MarcaRepository marcaRepository;

    @Inject
    CarrinhoRepository carrinhoRepository;

    @Inject
    PistaRepository pistaRepository;

    @Override
    @Transactional
    public List<MarcaResponseDTO> findAll() {
        return marcaRepository.listAll().stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Override
    @Transactional
    public MarcaResponseDTO findById(Long id) {
        Marca marca = marcaRepository.findByIdOptional(id)
                .orElseThrow(() -> new ResourceNotFoundException("Marca não encontrada com id: " + id));
        return toResponseDTO(marca);
    }

    @Override
    @Transactional
    public MarcaResponseDTO create(MarcaRequestDTO dto) {
        if (marcaRepository.findByNome(dto.nome()).isPresent()) {
            throw new DuplicateResourceException("Já existe uma marca cadastrada com o nome: " + dto.nome());
        }

        Marca marca = new Marca();
        marca.setNome(dto.nome().trim());
        marca.setPaisOrigem(dto.paisOrigem().trim());
        marca.setBandeiraPais(dto.bandeiraPais());
        marca.setLogoUrl(dto.logoUrl());
        marca.setStatus(dto.status());

        marcaRepository.persist(marca);
        return toResponseDTO(marca);
    }

    @Override
    @Transactional
    public MarcaResponseDTO update(Long id, MarcaRequestDTO dto) {
        Marca marca = marcaRepository.findByIdOptional(id)
                .orElseThrow(() -> new ResourceNotFoundException("Marca não encontrada com id: " + id));

        marcaRepository.findByNome(dto.nome())
                .filter(m -> !m.getId().equals(id))
                .ifPresent(m -> {
                    throw new DuplicateResourceException("Já existe outra marca com o nome: " + dto.nome());
                });

        marca.setNome(dto.nome().trim());
        marca.setPaisOrigem(dto.paisOrigem().trim());
        marca.setBandeiraPais(dto.bandeiraPais());
        marca.setLogoUrl(dto.logoUrl());
        marca.setStatus(dto.status());

        return toResponseDTO(marca);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Marca marca = marcaRepository.findByIdOptional(id)
                .orElseThrow(() -> new ResourceNotFoundException("Marca não encontrada com id: " + id));
        marcaRepository.delete(marca);
    }

    @Override
    @Transactional
    public ResumoMarcasDTO getResumo() {
        long totalMarcas = marcaRepository.count();
        long totalPaises = marcaRepository.listAll().stream()
                .map(Marca::getPaisOrigem)
                .distinct()
                .count();
        return new ResumoMarcasDTO(totalMarcas, totalPaises);
    }

    private MarcaResponseDTO toResponseDTO(Marca marca) {
        long totalCarrinhos = carrinhoRepository.count("marca.id = ?1", marca.getId());
        long totalPistas = pistaRepository.count("marca.id = ?1", marca.getId());
        long totalProdutos = totalCarrinhos + totalPistas;

        return new MarcaResponseDTO(
            marca.getId(),
            marca.getNome(),
            marca.getPaisOrigem(),
            marca.getBandeiraPais(),
            marca.getLogoUrl(),
            marca.getStatus(),
            totalProdutos,
            marca.getDataCadastro()
        );
    }
}
