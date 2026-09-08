package io.github.ojoseguilherme.model;

import jakarta.persistence.Entity;

@Entity 
public class Carrinho extends DefaultEntity {

    private String nome;
    private String descricao;
    private String escala;
    private Integer anoLancamento;
    private String cor;
    private Double preco;
    private Integer estoque;

    
    public String getNome() {
        return nome;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }
    public String getDescricao() {
        return descricao;
    }
    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
    public String getEscala() {
        return escala;
    }
    public void setEscala(String escala) {
        this.escala = escala;
    }
    public Integer getAnoLancamento() {
        return anoLancamento;
    }
    public void setAnoLancamento(Integer anoLancamento) {
        this.anoLancamento = anoLancamento;
    }
    public String getCor() {
        return cor;
    }
    public void setCor(String cor) {
        this.cor = cor;
    }
    public Double getPreco() {
        return preco;
    }
    public void setPreco(Double preco) {
        this.preco = preco;
    }
    public Integer getEstoque() {
        return estoque;
    }
    public void setEstoque(Integer estoque) {
        this.estoque = estoque;
    }

    
}
