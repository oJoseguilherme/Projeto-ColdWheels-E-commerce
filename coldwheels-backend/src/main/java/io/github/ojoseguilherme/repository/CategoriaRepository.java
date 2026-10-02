package io.github.ojoseguilherme.repository;

import io.github.ojoseguilherme.model.Categoria;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class CategoriaRepository implements PanacheRepository<Categoria> {

    public PanacheQuery<Categoria> findByNome(String nome) {
        return find("UPPER(nome) LIKE UPPER(?1) ORDER BY nome", "%" + nome + "%");
    }

    public boolean existsByNomeIgnoreCase(String nome) {
        return count("UPPER(nome) = UPPER(?1)", nome) > 0;
    }

    public boolean existsByNomeIgnoreCaseAndIdNot(String nome, Long id) {
        return count("UPPER(nome) = UPPER(?1) AND id <> ?2", nome, id) > 0;
    }

    @Override
    public PanacheQuery<Categoria> findAll() {
        return find("ORDER BY nome");
    }
}
