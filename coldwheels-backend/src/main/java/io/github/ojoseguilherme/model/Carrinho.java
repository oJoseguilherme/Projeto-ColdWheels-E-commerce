package io.github.ojoseguilherme.model;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;

@Entity 
public class Carrinho extends DefaultEntity {

    private String nome;
    private String descricao;
    private String escala;
    private Integer anoLancamento;
    private String cor;
    private Double preco;
    private Integer estoque;

    @ManyToOne
    @JoinColumn(name = "id_categoria")
    private Categoria categoria;

    @ManyToOne
    @JoinColumn(name = "id_marca")
    private Marca marca;

    @ManyToOne
    @JoinColumn(name = "id_fornecedor")
    private Fornecedor fornecedor;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_imagem_principal")
    private Arquivo imagemPrincipal;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_imagem_secundaria")
    private Arquivo imagemSecundaria;

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

    public Categoria getCategoria() {
        return categoria;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }

    public Marca getMarca() {
        return marca;
    }

    public void setMarca(Marca marca) {
        this.marca = marca;
    }

    public Fornecedor getFornecedor() {
        return fornecedor;
    }

    public void setFornecedor(Fornecedor fornecedor) {
        this.fornecedor = fornecedor;
    }

    public Arquivo getImagemPrincipal() {
        return imagemPrincipal;
    }

    public void setImagemPrincipal(Arquivo imagemPrincipal) {
        this.imagemPrincipal = imagemPrincipal;
    }

    public Arquivo getImagemSecundaria() {
        return imagemSecundaria;
    }

    public void setImagemSecundaria(Arquivo imagemSecundaria) {
        this.imagemSecundaria = imagemSecundaria;
    }
}

