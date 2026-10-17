package io.github.ojoseguilherme.repository;

import java.util.Optional;

import io.github.ojoseguilherme.model.Marca;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class MarcaRepository implements PanacheRepositoryBase<Marca, Long> {

    public Optional<Marca> findByNome(String nome) {
        String clean = nome.trim().toUpperCase();
        return find("UPPER(nome) = ?1 OR UPPER(nome) LIKE ?2", clean, clean + " (%").firstResultOptional();
    }
}
