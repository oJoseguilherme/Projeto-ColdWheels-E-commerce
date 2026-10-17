package io.github.ojoseguilherme.repository;

import io.github.ojoseguilherme.model.ItemPedido;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ItemPedidoRepository implements PanacheRepositoryBase<ItemPedido, Long> {
}
