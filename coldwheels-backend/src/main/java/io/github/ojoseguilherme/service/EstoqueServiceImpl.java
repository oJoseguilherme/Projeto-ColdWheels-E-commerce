package io.github.ojoseguilherme.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import io.github.ojoseguilherme.dto.AjusteEstoqueRequestDTO;
import io.github.ojoseguilherme.dto.ItemEstoqueDTO;
import io.github.ojoseguilherme.dto.ResumoEstoqueDTO;
import io.github.ojoseguilherme.exception.BusinessValidationException;
import io.github.ojoseguilherme.exception.ResourceNotFoundException;
import io.github.ojoseguilherme.model.Carrinho;
import io.github.ojoseguilherme.model.Pista;
import io.github.ojoseguilherme.repository.CarrinhoRepository;
import io.github.ojoseguilherme.repository.PistaRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class EstoqueServiceImpl implements EstoqueService {

    public static final int ESTOQUE_MINIMO_PADRAO = 5;

    @Inject
    CarrinhoRepository carrinhoRepository;

    @Inject
    PistaRepository pistaRepository;

    @Override
    @Transactional
    public List<ItemEstoqueDTO> listarTodos(String termo, String filtro) {
        List<ItemEstoqueDTO> itens = new ArrayList<>();

        for (Carrinho c : carrinhoRepository.listAll()) {
            itens.add(toItemEstoqueDTO(c));
        }

        for (Pista p : pistaRepository.listAll()) {
            itens.add(toItemEstoqueDTO(p));
        }

        // Filtro por termo de busca
        if (termo != null && !termo.trim().isEmpty()) {
            String t = termo.toLowerCase().trim();
            itens = itens.stream()
                    .filter(i -> i.nome().toLowerCase().contains(t) || i.codigoSku().toLowerCase().contains(t))
                    .toList();
        }

        // Filtro composto
        if (filtro != null && !filtro.trim().isEmpty() && !"TODOS".equalsIgnoreCase(filtro)) {
            if ("EM_ESTOQUE".equalsIgnoreCase(filtro) || "ESTOQUE_BAIXO".equalsIgnoreCase(filtro) || "ESGOTADO".equalsIgnoreCase(filtro)) {
                itens = itens.stream().filter(i -> i.status().equalsIgnoreCase(filtro)).toList();
            } else if ("tipo_carrinho".equalsIgnoreCase(filtro)) {
                itens = itens.stream().filter(i -> "CARRINHO".equalsIgnoreCase(i.tipo())).toList();
            } else if ("tipo_pista".equalsIgnoreCase(filtro)) {
                itens = itens.stream().filter(i -> "PISTA".equalsIgnoreCase(i.tipo())).toList();
            } else if ("ord_nome_asc".equalsIgnoreCase(filtro)) {
                itens = itens.stream().sorted(Comparator.comparing(ItemEstoqueDTO::nome, String.CASE_INSENSITIVE_ORDER)).toList();
            } else if ("ord_nome_desc".equalsIgnoreCase(filtro)) {
                itens = itens.stream().sorted(Comparator.comparing(ItemEstoqueDTO::nome, String.CASE_INSENSITIVE_ORDER).reversed()).toList();
            } else if ("ord_qtd_asc".equalsIgnoreCase(filtro)) {
                itens = itens.stream().sorted(Comparator.comparingInt(ItemEstoqueDTO::quantidade)).toList();
            } else if ("ord_qtd_desc".equalsIgnoreCase(filtro)) {
                itens = itens.stream().sorted(Comparator.comparingInt(ItemEstoqueDTO::quantidade).reversed()).toList();
            } else if ("ord_preco_asc".equalsIgnoreCase(filtro)) {
                itens = itens.stream().sorted(Comparator.comparingDouble(ItemEstoqueDTO::preco)).toList();
            } else if ("ord_preco_desc".equalsIgnoreCase(filtro)) {
                itens = itens.stream().sorted(Comparator.comparingDouble(ItemEstoqueDTO::preco).reversed()).toList();
            }
        }

        return itens;
    }

    @Override
    @Transactional
    public ResumoEstoqueDTO getResumo() {
        long esgotadoCarrinhos = carrinhoRepository.count("coalesce(estoque, 0) <= 0");
        long esgotadoPistas = pistaRepository.count("coalesce(estoque, 0) <= 0");
        long esgotado = esgotadoCarrinhos + esgotadoPistas;

        long baixoCarrinhos = carrinhoRepository.count("estoque > 0 and estoque <= ?1", ESTOQUE_MINIMO_PADRAO);
        long baixoPistas = pistaRepository.count("estoque > 0 and estoque <= ?1", ESTOQUE_MINIMO_PADRAO);
        long estoqueBaixo = baixoCarrinhos + baixoPistas;

        long emEstoqueCarrinhos = carrinhoRepository.count("estoque > ?1", ESTOQUE_MINIMO_PADRAO);
        long emEstoquePistas = pistaRepository.count("estoque > ?1", ESTOQUE_MINIMO_PADRAO);
        long emEstoque = emEstoqueCarrinhos + emEstoquePistas;

        return new ResumoEstoqueDTO(emEstoque, estoqueBaixo, esgotado);
    }

    @Override
    @Transactional
    public ItemEstoqueDTO ajustarEstoque(String tipo, Long id, AjusteEstoqueRequestDTO dto) {
        if ("CARRINHO".equalsIgnoreCase(tipo)) {
            Carrinho carrinho = carrinhoRepository.findByIdOptional(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Carrinho não encontrado com id: " + id));

            int novoEstoque = (carrinho.getEstoque() != null ? carrinho.getEstoque() : 0) + dto.delta();
            if (novoEstoque < 0) {
                throw new BusinessValidationException("O estoque do carrinho não pode ser negativo.");
            }
            carrinho.setEstoque(novoEstoque);
            return toItemEstoqueDTO(carrinho);

        } else if ("PISTA".equalsIgnoreCase(tipo)) {
            Pista pista = pistaRepository.findByIdOptional(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Pista não encontrada com id: " + id));

            int novoEstoque = (pista.getEstoque() != null ? pista.getEstoque() : 0) + dto.delta();
            if (novoEstoque < 0) {
                throw new BusinessValidationException("O estoque da pista não pode ser negativo.");
            }
            pista.setEstoque(novoEstoque);
            return toItemEstoqueDTO(pista);

        } else {
            throw new BusinessValidationException("Tipo de produto inválido: " + tipo + ". Utilize 'CARRINHO' ou 'PISTA'.");
        }
    }

    private ItemEstoqueDTO toItemEstoqueDTO(Carrinho c) {
        int qtd = c.getEstoque() != null ? c.getEstoque() : 0;
        String status = calcularStatus(qtd);
        String sku = String.format("CW-CAR-%03d", c.getId());
        double preco = c.getPreco() != null ? c.getPreco() : 0.0;

        return new ItemEstoqueDTO(
            c.getId(),
            c.getNome(),
            "CARRINHO",
            sku,
            qtd,
            ESTOQUE_MINIMO_PADRAO,
            status,
            preco
        );
    }

    private ItemEstoqueDTO toItemEstoqueDTO(Pista p) {
        int qtd = p.getEstoque() != null ? p.getEstoque() : 0;
        String status = calcularStatus(qtd);
        String sku = String.format("CW-TRK-%03d", p.getId());
        double preco = p.getPreco() != null ? p.getPreco().doubleValue() : 0.0;

        return new ItemEstoqueDTO(
            p.getId(),
            p.getNome(),
            "PISTA",
            sku,
            qtd,
            ESTOQUE_MINIMO_PADRAO,
            status,
            preco
        );
    }

    private String calcularStatus(int quantidade) {
        if (quantidade <= 0) {
            return "ESGOTADO";
        } else if (quantidade <= ESTOQUE_MINIMO_PADRAO) {
            return "ESTOQUE_BAIXO";
        } else {
            return "EM_ESTOQUE";
        }
    }
}
