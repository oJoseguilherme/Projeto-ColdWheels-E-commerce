package io.github.ojoseguilherme.repository;

import java.util.Optional;

import io.github.ojoseguilherme.model.Fornecedor;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class FornecedorRepository implements PanacheRepositoryBase<Fornecedor, Long> {

    public Optional<Fornecedor> findByCnpj(String cnpj) {
        return find("cnpj", cnpj.trim()).firstResultOptional();
    }
}
