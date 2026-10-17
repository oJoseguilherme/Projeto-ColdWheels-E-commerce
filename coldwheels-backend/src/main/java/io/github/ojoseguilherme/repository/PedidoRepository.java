package io.github.ojoseguilherme.repository;

import java.util.Optional;

import io.github.ojoseguilherme.model.Pedido;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class PedidoRepository implements PanacheRepositoryBase<Pedido, Long> {

    public Optional<Pedido> findByNumeroPedido(String numeroPedido) {
        return find("numeroPedido", numeroPedido).firstResultOptional();
    }
}
