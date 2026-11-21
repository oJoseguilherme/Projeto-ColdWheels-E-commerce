package io.github.ojoseguilherme.service;

import java.util.List;

import io.github.ojoseguilherme.exception.BusinessValidationException;
import io.github.ojoseguilherme.exception.DuplicateResourceException;
import io.github.ojoseguilherme.exception.ResourceNotFoundException;
import io.github.ojoseguilherme.model.Arquivo;
import io.github.ojoseguilherme.model.Carrinho;
import io.github.ojoseguilherme.model.Categoria;
import io.github.ojoseguilherme.model.Fornecedor;
import io.github.ojoseguilherme.model.Marca;
import io.github.ojoseguilherme.repository.CarrinhoRepository;
import io.github.ojoseguilherme.repository.CategoriaRepository;
import io.github.ojoseguilherme.repository.FornecedorRepository;
import io.github.ojoseguilherme.repository.MarcaRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class CarrinhoServiceImpl implements CarrinhoService {

    @Inject
    CarrinhoRepository repository;

    @Inject
    CategoriaRepository categoriaRepository;

    @Inject
    MarcaRepository marcaRepository;

    @Inject
    FornecedorRepository fornecedorRepository;

    @Inject
    ArquivoService arquivoService;

    @Override
    public List<Carrinho> findAll() {
        return repository.findAll().list();
    }

    @Override
    public List<Carrinho> findAll(int page, int pageSize) {
        return repository.findAll()
                .page(page, pageSize)
                .list();
    }

    @Override
    public List<Carrinho> findByFiltro(
            String nome,
            Long idCategoria,
            int page,
            int pageSize) {

        return repository.findFiltro(nome, idCategoria)
                .page(page, pageSize)
                .list();
    }

    @Override
    public long count() {
        return repository.findAll().count();
    }

    @Override
    public long count(String nome, Long idCategoria) {
        return repository.countFiltro(nome, idCategoria);
    }

    @Override
    public Carrinho findById(Long id) {
        return repository.findByIdOptional(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Carrinho não encontrado para o ID: " + id
                ));
    }

    @Override
    public List<Carrinho> findByNome(String nome) {
        return repository.findByNome(nome).list();
    }

    @Override
    @Transactional
    public Carrinho create(Carrinho carrinho) {
        if (repository.existByNomeIgnoreCase(carrinho.getNome())) {
            throw new DuplicateResourceException(
                    "Já existe um carrinho com este nome."
            );
        }

        vincularCategoria(carrinho);
        vincularMarca(carrinho);
        vincularFornecedor(carrinho);

        repository.persist(carrinho);

        return carrinho;
    }

    @Override
    @Transactional
    public void update(Long id, Carrinho carrinho) {
        Carrinho existente = findById(id);

        if (repository.existsByNomeIgnoreCaseAndIdNot(
                carrinho.getNome(),
                id)) {

            throw new DuplicateResourceException(
                    "Já existe outro carrinho com este nome."
            );
        }

        vincularCategoria(carrinho);
        vincularMarca(carrinho);
        vincularFornecedor(carrinho);

        existente.setNome(carrinho.getNome());
        existente.setDescricao(carrinho.getDescricao());
        existente.setEscala(carrinho.getEscala());
        existente.setAnoLancamento(carrinho.getAnoLancamento());
        existente.setCor(carrinho.getCor());
        existente.setPreco(carrinho.getPreco());
        existente.setEstoque(carrinho.getEstoque());
        existente.setCategoria(carrinho.getCategoria());
        existente.setMarca(carrinho.getMarca());
        existente.setFornecedor(carrinho.getFornecedor());
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Carrinho carrinho = findById(id);
        Arquivo principal = carrinho.getImagemPrincipal();
        Arquivo secundaria = carrinho.getImagemSecundaria();
        carrinho.setImagemPrincipal(null);
        carrinho.setImagemSecundaria(null);

        repository.delete(carrinho);
        repository.flush();

        arquivoService.excluir(principal);
        arquivoService.excluir(secundaria);
    }

    @Override
    @Transactional
    public Carrinho atualizarImagem(Long id, String slot, String nomeOriginal, String contentType, byte[] conteudo) {
        boolean isPrincipal = isSlotPrincipal(slot);
        Carrinho carrinho = findById(id);

        Arquivo anterior = isPrincipal ? carrinho.getImagemPrincipal() : carrinho.getImagemSecundaria();
        Arquivo novo = arquivoService.salvarImagem("carrinhos/" + id, nomeOriginal, contentType, conteudo);

        if (isPrincipal) {
            carrinho.setImagemPrincipal(novo);
        } else {
            carrinho.setImagemSecundaria(novo);
        }
        repository.flush();

        if (anterior != null) {
            arquivoService.excluir(anterior);
        }
        return carrinho;
    }

    @Override
    @Transactional
    public Carrinho removerImagem(Long id, String slot) {
        boolean isPrincipal = isSlotPrincipal(slot);
        Carrinho carrinho = findById(id);

        Arquivo alvo = isPrincipal ? carrinho.getImagemPrincipal() : carrinho.getImagemSecundaria();
        if (alvo == null) {
            return carrinho;
        }

        if (isPrincipal) {
            carrinho.setImagemPrincipal(null);
        } else {
            carrinho.setImagemSecundaria(null);
        }
        repository.flush();

        arquivoService.excluir(alvo);
        return carrinho;
    }

    private boolean isSlotPrincipal(String slot) {
        if ("principal".equalsIgnoreCase(slot)) {
            return true;
        }
        if ("secundaria".equalsIgnoreCase(slot)) {
            return false;
        }
        throw new BusinessValidationException("Slot de imagem inválido. Use 'principal' ou 'secundaria'.");
    }

    private void vincularCategoria(Carrinho carrinho) {
        if (carrinho.getCategoria() == null
                || carrinho.getCategoria().getId() == null) {

            throw new ResourceNotFoundException(
                    "Categoria informada não foi encontrada."
            );
        }

        Long categoriaId = carrinho.getCategoria().getId();

        Categoria categoria = categoriaRepository
                .findByIdOptional(categoriaId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Categoria não encontrada para o ID: "
                                + categoriaId
                ));

        carrinho.setCategoria(categoria);
    }

    private void vincularMarca(Carrinho carrinho) {
        if (carrinho.getMarca() == null || carrinho.getMarca().getId() == null) {
            carrinho.setMarca(null);
            return;
        }

        Long marcaId = carrinho.getMarca().getId();
        Marca marca = marcaRepository.findByIdOptional(marcaId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Marca não encontrada para o ID: " + marcaId
                ));
        carrinho.setMarca(marca);
    }

    private void vincularFornecedor(Carrinho carrinho) {
        if (carrinho.getFornecedor() == null || carrinho.getFornecedor().getId() == null) {
            carrinho.setFornecedor(null);
            return;
        }

        Long fornecedorId = carrinho.getFornecedor().getId();
        Fornecedor fornecedor = fornecedorRepository.findByIdOptional(fornecedorId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Fornecedor não encontrado para o ID: " + fornecedorId
                ));
        carrinho.setFornecedor(fornecedor);
    }
}