package io.github.ojoseguilherme.service;

import java.util.List;

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
        return repository.findAll().page(page, pageSize).list();
    }

    @Override
    public List<Carrinho> findByFiltro(String nome, Long idCategoria, int page, int pageSize) {
        return repository.findFiltro(nome, idCategoria).page(page, pageSize).list();
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
        return repository.findById(id);
    }

    @Override
    public List<Carrinho> findByNome(String nome) {
        return repository.findByNome(nome).list();
    }

    @Override
    @Transactional 
    public Carrinho create(Carrinho carrinho) {
        if (repository.existByNomeIgnoreCase(carrinho.getNome())) {
            throw new IllegalArgumentException("Já existe um carrinho com o nome '" + carrinho.getNome() + "' cadastrado.");
        }

        vincularCategoria(carrinho);

        repository.persist(carrinho);
        return carrinho;
    }

    @Override   
    @Transactional 
    public void update(Long id, Carrinho carrinho) {
        Carrinho c = findById(id);

        if (c == null) {
            throw new IllegalArgumentException("Carrinho não encontrado para o ID: " + id);
        }
        if (repository.existsByNomeIgnoreCaseAndIdNot(carrinho.getNome(), id)) {
            throw new IllegalArgumentException("Já existe outro carrinho com o nome '" + carrinho.getNome() + "'.");
        }

        vincularCategoria(carrinho);

        c.setNome(carrinho.getNome());
        c.setDescricao(carrinho.getDescricao());
        c.setEscala(carrinho.getEscala());
        c.setAnoLancamento(carrinho.getAnoLancamento());
        c.setCor(carrinho.getCor());
        c.setPreco(carrinho.getPreco());
        c.setEstoque(carrinho.getEstoque());
        c.setCategoria(carrinho.getCategoria());
    }

    @Override
    @Transactional 
    public void delete(Long id) {
        repository.deleteById(id);
    }

    private void vincularCategoria(Carrinho carrinho) {
        if (carrinho.getCategoria() != null && carrinho.getCategoria().getId() != null) {
            Categoria categoria = categoriaRepository.findById(carrinho.getCategoria().getId());
            if (categoria == null) {
                throw new IllegalArgumentException("Categoria com ID " + carrinho.getCategoria().getId() + " não encontrada.");
            }
            carrinho.setCategoria(categoria);
        }
    }
}
