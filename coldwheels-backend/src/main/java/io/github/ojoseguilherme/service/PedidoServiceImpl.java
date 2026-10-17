package io.github.ojoseguilherme.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import io.github.ojoseguilherme.dto.ItemPedidoRequestDTO;
import io.github.ojoseguilherme.dto.ItemPedidoResponseDTO;
import io.github.ojoseguilherme.dto.PedidoRequestDTO;
import io.github.ojoseguilherme.dto.PedidoResponseDTO;
import io.github.ojoseguilherme.dto.StatusPedidoRequestDTO;
import io.github.ojoseguilherme.exception.BusinessValidationException;
import io.github.ojoseguilherme.exception.DuplicateResourceException;
import io.github.ojoseguilherme.exception.ResourceNotFoundException;
import io.github.ojoseguilherme.model.Carrinho;
import io.github.ojoseguilherme.model.Cliente;
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
public class PedidoServiceImpl implements PedidoService {

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
    public List<PedidoResponseDTO> listarTodos(String termo, String status) {
        List<Pedido> pedidos = pedidoRepository.listAll();

        if (status != null && !status.trim().isEmpty() && !"TODOS".equalsIgnoreCase(status)) {
            pedidos = pedidos.stream()
                    .filter(p -> p.getStatus().equalsIgnoreCase(status))
                    .toList();
        }

        if (termo != null && !termo.trim().isEmpty()) {
            String t = termo.toLowerCase().trim();
            pedidos = pedidos.stream()
                    .filter(p -> {
                        String num = p.getNumeroPedido() != null ? p.getNumeroPedido().toLowerCase() : "";
                        String nomeCli = (p.getCliente() != null && p.getCliente().getPessoa() != null)
                                ? p.getCliente().getPessoa().getNome().toLowerCase() : "";
                        String emailCli = (p.getCliente() != null && p.getCliente().getPessoa() != null)
                                ? p.getCliente().getPessoa().getEmail().toLowerCase() : "";
                        return num.contains(t) || nomeCli.contains(t) || emailCli.contains(t);
                    })
                    .toList();
        }

        return pedidos.stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Override
    @Transactional
    public PedidoResponseDTO buscarPorId(Long id) {
        Pedido pedido = pedidoRepository.findByIdOptional(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado com id: " + id));
        return toResponseDTO(pedido);
    }

    @Override
    @Transactional
    public PedidoResponseDTO criar(PedidoRequestDTO dto) {
        if (dto.numeroPedido() != null && pedidoRepository.findByNumeroPedido(dto.numeroPedido()).isPresent()) {
            throw new DuplicateResourceException("Já existe um pedido com o número: " + dto.numeroPedido());
        }

        Cliente cliente = null;
        if (dto.idCliente() != null) {
            cliente = clienteRepository.findByIdOptional(dto.idCliente())
                    .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com id: " + dto.idCliente()));
        }

        Pedido pedido = new Pedido();
        String numero = dto.numeroPedido() != null ? dto.numeroPedido() : "CW-" + (1000 + pedidoRepository.count() + 1);
        pedido.setNumeroPedido(numero);
        pedido.setCliente(cliente);
        pedido.setStatus(dto.status() != null ? dto.status().toUpperCase() : "PENDENTE");
        pedido.setDataPedido(LocalDateTime.now());

        if (dto.itens() != null) {
            for (ItemPedidoRequestDTO itemDto : dto.itens()) {
                ItemPedido item = new ItemPedido();
                item.setQuantidade(itemDto.quantidade());
                item.setPrecoUnitario(itemDto.precoUnitario());

                if ("CARRINHO".equalsIgnoreCase(itemDto.tipoProduto())) {
                    Carrinho c = carrinhoRepository.findByIdOptional(itemDto.idProduto())
                            .orElseThrow(() -> new ResourceNotFoundException("Carrinho não encontrado com id: " + itemDto.idProduto()));
                    item.setCarrinho(c);
                } else if ("PISTA".equalsIgnoreCase(itemDto.tipoProduto())) {
                    Pista p = pistaRepository.findByIdOptional(itemDto.idProduto())
                            .orElseThrow(() -> new ResourceNotFoundException("Pista não encontrada com id: " + itemDto.idProduto()));
                    item.setPista(p);
                } else {
                    throw new BusinessValidationException("Tipo de produto inválido no item: " + itemDto.tipoProduto());
                }

                pedido.adicionarItem(item);
            }
        }

        pedidoRepository.persist(pedido);
        return toResponseDTO(pedido);
    }

    @Override
    @Transactional
    public PedidoResponseDTO atualizarStatus(Long id, StatusPedidoRequestDTO dto) {
        Pedido pedido = pedidoRepository.findByIdOptional(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado com id: " + id));

        pedido.setStatus(dto.status().toUpperCase());
        return toResponseDTO(pedido);
    }

    private PedidoResponseDTO toResponseDTO(Pedido pedido) {
        String nomeCliente = (pedido.getCliente() != null && pedido.getCliente().getPessoa() != null)
                ? pedido.getCliente().getPessoa().getNome() : "Cliente ColdWheels";
        String emailCliente = (pedido.getCliente() != null && pedido.getCliente().getPessoa() != null)
                ? pedido.getCliente().getPessoa().getEmail() : "contato@coldwheels.com";

        int itensTotais = 0;
        BigDecimal quantiaTotal = BigDecimal.ZERO;
        List<ItemPedidoResponseDTO> itensDTO = new ArrayList<>();

        if (pedido.getItens() != null) {
            for (ItemPedido item : pedido.getItens()) {
                itensTotais += item.getQuantidade();
                BigDecimal sub = item.getPrecoUnitario().multiply(BigDecimal.valueOf(item.getQuantidade()));
                quantiaTotal = quantiaTotal.add(sub);

                String tipo = item.getCarrinho() != null ? "CARRINHO" : "PISTA";
                Long idProd = item.getCarrinho() != null ? item.getCarrinho().getId() : (item.getPista() != null ? item.getPista().getId() : 0L);
                String nomeProd = item.getCarrinho() != null ? item.getCarrinho().getNome() : (item.getPista() != null ? item.getPista().getNome() : "Produto");

                itensDTO.add(new ItemPedidoResponseDTO(
                    item.getId(),
                    tipo,
                    idProd,
                    nomeProd,
                    item.getQuantidade(),
                    item.getPrecoUnitario().doubleValue(),
                    sub.doubleValue()
                ));
            }
        }

        String dataIso = pedido.getDataPedido() != null
                ? pedido.getDataPedido().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
                : LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);

        return new PedidoResponseDTO(
            pedido.getId(),
            pedido.getNumeroPedido(),
            nomeCliente,
            emailCliente,
            dataIso,
            itensTotais,
            quantiaTotal.doubleValue(),
            pedido.getStatus(),
            itensDTO
        );
    }
}
