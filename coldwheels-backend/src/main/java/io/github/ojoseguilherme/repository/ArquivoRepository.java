package io.github.ojoseguilherme.repository;

import io.github.ojoseguilherme.model.Arquivo;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ArquivoRepository implements PanacheRepository<Arquivo> {
}
