package io.github.ojoseguilherme.repository;

import java.util.List;
import java.util.Optional;

import io.github.ojoseguilherme.model.Estado;
import io.github.ojoseguilherme.model.Municipio;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class MunicipioRepository implements PanacheRepository<Municipio> {

    public Optional<Municipio> findByCodigoIbge(String codigoIbge) {
        return find("codigoIbge", codigoIbge)
                .firstResultOptional();
    }

    public List<Municipio> listByEstado(Estado estado) {
        return find(
            "estado = ?1 order by nome",
            estado
        ).list();
    }
}