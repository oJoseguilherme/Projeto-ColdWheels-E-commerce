package io.github.ojoseguilherme.repository;

import java.util.Locale;

import io.github.ojoseguilherme.model.Pessoa;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class PessoaRepository implements PanacheRepository<Pessoa> {

    public boolean existsByCpf(String cpf) {
        return count("cpf = ?1", cpf) > 0;
    }

    public boolean existsByCpfAndIdNot(String cpf, Long id) {
        return count(
            "cpf = ?1 AND id <> ?2",
            cpf,
            id
        ) > 0;
    }

    public boolean existsByEmailIgnoreCase(String email) {
        String emailNormalizado = normalizarEmail(email);

        return count(
            "LOWER(email) = ?1",
            emailNormalizado
        ) > 0;
    }

    public boolean existsByEmailIgnoreCaseAndIdNot(
            String email,
            Long id) {

        String emailNormalizado = normalizarEmail(email);

        return count(
            "LOWER(email) = ?1 AND id <> ?2",
            emailNormalizado,
            id
        ) > 0;
    }

    private String normalizarEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}