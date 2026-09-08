package io.github.ojoseguilherme.service;

import java.util.List;

import io.github.ojoseguilherme.model.Carrinho;
import io.github.ojoseguilherme.repository.CarrinhoRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped 
public class CarrinhoServiceImpl implements CarrinhoService {

    @Inject 
    CarrinhoRepository repository;

    @Override
    public List<Carrinho> findAll() {
       return repository.findAll().list();
    }

    @Override
    public Carrinho findById(Long id) {
     return repository.findById(id);
    }

    @Override
    public List<Carrinho> findByNome(String nome) {
        return repository.findByNome(nome).list();
    }

    @Override
    @Transactional 
    public Carrinho create(Carrinho carrinho) {
        if(repository.existByNomeIgnoreCase(carrinho.getNome()))
        {
            throw new IllegalArgumentException("Já existe um carrinho com o nome '" + carrinho.getNome() + "' cadastrado.");
        }
        repository.persist(carrinho);
        return carrinho;
    }

    @Override   
    @Transactional 
    public void update(Long id, Carrinho carrinho) {
        Carrinho c = findById(id);

        if (c ==null) {

            throw new IllegalArgumentException("Carrinho não encontrado para o ID: " + id);
        }
        if(repository.existsByNomeIgnoreCaseAndIdNot(carrinho.getNome(), id)){
             throw new IllegalArgumentException("Já existe outro carrinho com o nome '" + carrinho.getNome() + "'.");
        }

        c.setNome(carrinho.getNome());
        c.setDescricao(carrinho.getDescricao());
        c.setEscala(carrinho.getEscala());
        c.setAnoLancamento(carrinho.getAnoLancamento());
        c.setCor(carrinho.getCor());
        c.setPreco(carrinho.getPreco());
        c.setEstoque(carrinho.getEstoque());
    }

    @Override
    @Transactional 
    public void delete(Long id) {
       repository.deleteById(id);


}
}
