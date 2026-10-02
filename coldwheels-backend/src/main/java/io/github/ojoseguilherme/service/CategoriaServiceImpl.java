package io.github.ojoseguilherme.service;

import java.util.List;

import io.github.ojoseguilherme.model.Categoria;
import io.github.ojoseguilherme.repository.CategoriaRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class CategoriaServiceImpl implements CategoriaService {

    @Inject
    CategoriaRepository repository;

    @Override
    public List<Categoria> findAll() {
        return repository.findAll().list();
    }

    @Override
    public Categoria findById(Long id) {
        return repository.findById(id);
    }

    @Override
    public List<Categoria> findByNome(String nome) {
        return repository.findByNome(nome).list();
    }

    @Override
    @Transactional
    public Categoria create(Categoria categoria) {
        if (repository.existsByNomeIgnoreCase(categoria.getNome())) {
            throw new IllegalArgumentException("Já existe uma categoria com o nome '" + categoria.getNome() + "'.");
        }
        repository.persist(categoria);
        return categoria;
    }

    @Override
    @Transactional
    public void update(Long id, Categoria categoria) {
        Categoria cat = findById(id);
        if (cat == null) {
            throw new IllegalArgumentException("Categoria não encontrada para o ID: " + id);
        }
        if (repository.existsByNomeIgnoreCaseAndIdNot(categoria.getNome(), id)) {
            throw new IllegalArgumentException("Já existe outra categoria com o nome '" + categoria.getNome() + "'.");
        }
        cat.setNome(categoria.getNome());
        cat.setDescricao(categoria.getDescricao());
    }

    @Override
    @Transactional
    public void delete(Long id) {
        repository.deleteById(id);
    }
}
