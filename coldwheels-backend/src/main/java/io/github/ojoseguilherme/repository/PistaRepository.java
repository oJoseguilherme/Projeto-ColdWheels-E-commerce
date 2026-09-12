package io.github.ojoseguilherme.repository;

import io.github.ojoseguilherme.model.Pista;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class PistaRepository implements PanacheRepository<Pista> {

    public boolean existsByNome(String nome) {
        return count(
            "lower(trim(nome)) = lower(?1)",
            nome.trim()
        ) > 0;
    }

    public boolean existsByNomeAndIdNot(String nome, Long id) {
        return count(
            "lower(trim(nome)) = lower(?1) and id <> ?2",
            nome.trim(),
            id
        ) > 0;
    }
}