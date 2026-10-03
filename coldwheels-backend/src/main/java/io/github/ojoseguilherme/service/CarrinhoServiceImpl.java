package io.github.ojoseguilherme.service;

import java.util.List;

import io.github.ojoseguilherme.exception.DuplicateResourceException;
import io.github.ojoseguilherme.exception.ResourceNotFoundException;
import io.github.ojoseguilherme.model.Carrinho;
import io.github.ojoseguilherme.model.Categoria;
import io.github.ojoseguilherme.repository.CarrinhoRepository;
import io.github.ojoseguilherme.repository.CategoriaRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class CarrinhoServiceImpl implements CarrinhoService {

    @Inject
    CarrinhoRepository repository;

    @Inject
    CategoriaRepository categoriaRepository;

    @Override
    public List<Carrinho> findAll() {
        return repository.findAll().list();
    }

    @Override
    public List<Carrinho> findAll(int page, int pageSize) {
        return repository.findAll()
                .page(page, pageSize)
                .list();
    }

    @Override
    public List<Carrinho> findByFiltro(
            String nome,
            Long idCategoria,
            int page,
            int pageSize) {

        return repository.findFiltro(nome, idCategoria)
                .page(page, pageSize)
                .list();
    }

    @Override
    public long count() {
        return repository.findAll().count();
    }

    @Override
    public long count(String nome, Long idCategoria) {
        return repository.countFiltro(nome, idCategoria);
    }

    @Override
    public Carrinho findById(Long id) {
        return repository.findByIdOptional(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Carrinho não encontrado para o ID: " + id
                ));
    }

    @Override
    public List<Carrinho> findByNome(String nome) {
        return repository.findByNome(nome).list();
    }

    @Override
    @Transactional
    public Carrinho create(Carrinho carrinho) {
        if (repository.existByNomeIgnoreCase(carrinho.getNome())) {
            throw new DuplicateResourceException(
                    "Já existe um carrinho com este nome."
            );
        }

        vincularCategoria(carrinho);

        repository.persist(carrinho);

        return carrinho;
    }

    @Override
    @Transactional
    public void update(Long id, Carrinho carrinho) {
        Carrinho existente = findById(id);

        if (repository.existsByNomeIgnoreCaseAndIdNot(
                carrinho.getNome(),
                id)) {

            throw new DuplicateResourceException(
                    "Já existe outro carrinho com este nome."
            );
        }

        vincularCategoria(carrinho);

        existente.setNome(carrinho.getNome());
        existente.setDescricao(carrinho.getDescricao());
        existente.setEscala(carrinho.getEscala());
        existente.setAnoLancamento(carrinho.getAnoLancamento());
        existente.setCor(carrinho.getCor());
        existente.setPreco(carrinho.getPreco());
        existente.setEstoque(carrinho.getEstoque());
        existente.setCategoria(carrinho.getCategoria());
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Carrinho carrinho = findById(id);
        repository.delete(carrinho);
    }

    private void vincularCategoria(Carrinho carrinho) {
        if (carrinho.getCategoria() == null
                || carrinho.getCategoria().getId() == null) {

            throw new ResourceNotFoundException(
                    "Categoria informada não foi encontrada."
            );
        }

        Long categoriaId = carrinho.getCategoria().getId();

        Categoria categoria = categoriaRepository
                .findByIdOptional(categoriaId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Categoria não encontrada para o ID: "
                                + categoriaId
                ));

        carrinho.setCategoria(categoria);
    }
}