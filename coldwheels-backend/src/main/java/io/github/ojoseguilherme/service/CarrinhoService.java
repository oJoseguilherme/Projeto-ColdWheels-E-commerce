package io.github.ojoseguilherme.service;

import java.util.List;

import io.github.ojoseguilherme.model.Carrinho;

public interface CarrinhoService {
List<Carrinho> findAll();

Carrinho findById(Long id);

List<Carrinho> findByNome(String nome);

Carrinho create(Carrinho carrinho);

void update(Long id, Carrinho carrinho);

void delete(Long id);

}
