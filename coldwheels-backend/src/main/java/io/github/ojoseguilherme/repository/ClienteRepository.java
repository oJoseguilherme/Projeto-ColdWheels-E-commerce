package io.github.ojoseguilherme.repository;

import java.util.List;
import java.util.Optional;

import io.github.ojoseguilherme.model.Cliente;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ClienteRepository implements PanacheRepository<Cliente> {

    public List<Cliente> listAllWithDetails() {
        return find(
            """
            FROM Cliente c
            JOIN FETCH c.pessoa p
            JOIN FETCH p.endereco.municipio m
            JOIN FETCH m.estado
            ORDER BY c.id
            """
        ).list();
    }

    public Optional<Cliente> findByIdWithDetails(Long id) {
        return find(
            """
            FROM Cliente c
            JOIN FETCH c.pessoa p
            JOIN FETCH p.endereco.municipio m
            JOIN FETCH m.estado
            WHERE c.id = ?1
            """,
            id
        ).firstResultOptional();
    }
}