package io.github.ojoseguilherme.repository;

import java.util.Optional;

import io.github.ojoseguilherme.model.Estado;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class EstadoRepository implements PanacheRepository<Estado> {

    public Optional<Estado> findByCodigoIbge(String codigoIbge) {
        return find("codigoIbge", codigoIbge).firstResultOptional();
    }

    public Optional<Estado> findBySigla(String sigla) {
        return find("sigla", sigla).firstResultOptional();
    }
}