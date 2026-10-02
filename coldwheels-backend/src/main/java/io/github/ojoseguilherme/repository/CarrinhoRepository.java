package io.github.ojoseguilherme.repository;

import io.github.ojoseguilherme.model.Carrinho;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped 
public class CarrinhoRepository implements 
PanacheRepository<Carrinho>{

    //Busca carrinhos pelo nome ignorando maiúsculas e minúsculas (LIKE %nome%)
    public PanacheQuery<Carrinho> findByNome(String nome){
        return  find("UPPER (nome)LIKE UPPER (?1)" , "%" +nome+"%");
    }

    //verifica se já existe outro carrinho com esse nome(usado ao criar)
    public boolean existByNomeIgnoreCase(String nome){
        return count("UPPER(nome) = UPPER(?1)", nome)>0;
    }

    //Verifica se já existe um outro carrinho com esse nome, exceto o atual(usado ao editar)
    public boolean existsByNomeIgnoreCaseAndIdNot(String nome, Long id){
        return count("UPPER (nome) = UPPER(?1)AND id <> ?2", nome,id) >0;
    }

    // Consulta com suporte a filtro por nome e/ou relacionamento ManyToOne categoria
    public PanacheQuery<Carrinho> findFiltro(String nome, Long idCategoria) {
        if (nome != null && !nome.isBlank() && idCategoria != null) {
            return find("UPPER(nome) LIKE UPPER(?1) AND categoria.id = ?2 ORDER BY nome", "%" + nome.trim() + "%", idCategoria);
        } else if (nome != null && !nome.isBlank()) {
            return find("UPPER(nome) LIKE UPPER(?1) ORDER BY nome", "%" + nome.trim() + "%");
        } else if (idCategoria != null) {
            return find("categoria.id = ?1 ORDER BY nome", idCategoria);
        } else {
            return find("ORDER BY nome");
        }
    }

    // Contagem com os mesmos filtros para paginação
    public long countFiltro(String nome, Long idCategoria) {
        if (nome != null && !nome.isBlank() && idCategoria != null) {
            return count("UPPER(nome) LIKE UPPER(?1) AND categoria.id = ?2", "%" + nome.trim() + "%", idCategoria);
        } else if (nome != null && !nome.isBlank()) {
            return count("UPPER(nome) LIKE UPPER(?1)", "%" + nome.trim() + "%");
        } else if (idCategoria != null) {
            return count("categoria.id = ?1", idCategoria);
        } else {
            return count();
        }
    }

}
