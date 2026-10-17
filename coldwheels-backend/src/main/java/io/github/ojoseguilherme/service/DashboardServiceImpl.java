package io.github.ojoseguilherme.service;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import io.github.ojoseguilherme.dto.DashboardMetricasDTO;
import io.github.ojoseguilherme.dto.ItemEstoqueBaixoDTO;
import io.github.ojoseguilherme.dto.PedidoRecenteDTO;
import io.github.ojoseguilherme.model.Carrinho;
import io.github.ojoseguilherme.model.ItemPedido;
import io.github.ojoseguilherme.model.Pedido;
import io.github.ojoseguilherme.model.Pista;
import io.github.ojoseguilherme.repository.CarrinhoRepository;
import io.github.ojoseguilherme.repository.ClienteRepository;
import io.github.ojoseguilherme.repository.PedidoRepository;
import io.github.ojoseguilherme.repository.PistaRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class DashboardServiceImpl implements DashboardService {

    public static final int ESTOQUE_MINIMO_CRITICO = 5;

    @Inject
    PedidoRepository pedidoRepository;

    @Inject
    ClienteRepository clienteRepository;

    @Inject
    CarrinhoRepository carrinhoRepository;

    @Inject
    PistaRepository pistaRepository;

    @Override
    @Transactional
    public DashboardMetricasDTO getMetricas() {
        List<Pedido> pedidos = pedidoRepository.listAll();

        BigDecimal vendasTotais = BigDecimal.ZERO;
        for (Pedido p : pedidos) {
            if ("PAGO".equalsIgnoreCase(p.getStatus()) || "ENVIADO".equalsIgnoreCase(p.getStatus()) || "ENTREGUE".equalsIgnoreCase(p.getStatus())) {
                if (p.getItens() != null) {
                    for (ItemPedido item : p.getItens()) {
                        BigDecimal sub = item.getPrecoUnitario().multiply(BigDecimal.valueOf(item.getQuantidade()));
                        vendasTotais = vendasTotais.add(sub);
                    }
                }
            }
        }

        long totalUsuarios = clienteRepository.count();
        long totalPedidos = pedidos.size();

        long carrinhosBaixo = carrinhoRepository.count("estoque <= ?1", ESTOQUE_MINIMO_CRITICO);
        long pistasBaixo = pistaRepository.count("estoque <= ?1", ESTOQUE_MINIMO_CRITICO);
        long estoqueBaixoCount = carrinhosBaixo + pistasBaixo;

        return new DashboardMetricasDTO(
            vendasTotais.doubleValue(),
            totalUsuarios,
            totalPedidos,
            estoqueBaixoCount
        );
    }

    @Override
    @Transactional
    public List<ItemEstoqueBaixoDTO> getProdutosEstoqueBaixo() {
        List<ItemEstoqueBaixoDTO> criticos = new ArrayList<>();

        for (Carrinho c : carrinhoRepository.list("estoque <= ?1", ESTOQUE_MINIMO_CRITICO)) {
            criticos.add(new ItemEstoqueBaixoDTO(
                c.getId(),
                c.getNome(),
                "CARRINHO",
                c.getEstoque(),
                ESTOQUE_MINIMO_CRITICO,
                c.getPreco() != null ? c.getPreco() : 0.0
            ));
        }

        for (Pista p : pistaRepository.list("estoque <= ?1", ESTOQUE_MINIMO_CRITICO)) {
            criticos.add(new ItemEstoqueBaixoDTO(
                p.getId(),
                p.getNome(),
                "PISTA",
                p.getEstoque(),
                ESTOQUE_MINIMO_CRITICO,
                p.getPreco() != null ? p.getPreco().doubleValue() : 0.0
            ));
        }

        criticos.sort(Comparator.comparingInt(ItemEstoqueBaixoDTO::estoqueAtual));
        return criticos.stream().limit(6).toList();
    }

    @Override
    @Transactional
    public List<PedidoRecenteDTO> getPedidosRecentes() {
        List<Pedido> pedidos = pedidoRepository.listAll();
        pedidos.sort((a, b) -> b.getDataPedido().compareTo(a.getDataPedido()));

        return pedidos.stream().limit(5).map(p -> {
            String nomeCliente = (p.getCliente() != null && p.getCliente().getPessoa() != null)
                    ? p.getCliente().getPessoa().getNome() : "Cliente ColdWheels";

            int totalItens = 0;
            BigDecimal valorTotal = BigDecimal.ZERO;
            if (p.getItens() != null) {
                for (ItemPedido item : p.getItens()) {
                    totalItens += item.getQuantidade();
                    valorTotal = valorTotal.add(item.getPrecoUnitario().multiply(BigDecimal.valueOf(item.getQuantidade())));
                }
            }

            String dataIso = p.getDataPedido() != null
                    ? p.getDataPedido().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
                    : "";

            return new PedidoRecenteDTO(
                p.getId(),
                p.getNumeroPedido(),
                nomeCliente,
                dataIso,
                totalItens,
                valorTotal.doubleValue(),
                p.getStatus()
            );
        }).toList();
    }
}
