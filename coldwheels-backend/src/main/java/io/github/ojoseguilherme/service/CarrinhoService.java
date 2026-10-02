package io.github.ojoseguilherme.service;

import java.util.List;

import io.github.ojoseguilherme.model.Carrinho;

public interface CarrinhoService {
    List<Carrinho> findAll();
    List<Carrinho> findAll(int page, int pageSize);
    List<Carrinho> findByFiltro(String nome, Long idCategoria, int page, int pageSize);
    long count();
    long count(String nome, Long idCategoria);

    Carrinho findById(Long id);
    List<Carrinho> findByNome(String nome);
    Carrinho create(Carrinho carrinho);
    void update(Long id, Carrinho carrinho);
    void delete(Long id);
}
