package io.github.ojoseguilherme.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;

@Entity
public class Fornecedor extends DefaultEntity {

    @Column(name = "razao_social", length = 150, nullable = false)
    private String razaoSocial;

    @Column(name = "nome_fantasia", length = 120, nullable = false)
    private String nomeFantasia;

    @Column(length = 20, nullable = false, unique = true)
    private String cnpj;

    @Column(name = "contato_nome", length = 100, nullable = false)
    private String contatoNome;

    @Column(length = 120, nullable = false)
    private String email;

    @Column(length = 30, nullable = false)
    private String telefone;

    @Column(length = 100, nullable = false)
    private String cidade;

    @Column(length = 2, nullable = false)
    private String uf;

    @Column(name = "prazo_entrega_dias", nullable = false)
    private Integer prazoEntregaDias;

    @Column(length = 20, nullable = false)
    private String status; // 'ATIVO', 'EM_ANALISE', 'INATIVO'

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "fornecedor_marca",
        joinColumns = @JoinColumn(name = "id_fornecedor"),
        inverseJoinColumns = @JoinColumn(name = "id_marca")
    )
    private List<Marca> marcasFornecidas = new ArrayList<>();

    public String getRazaoSocial() {
        return razaoSocial;
    }

    public void setRazaoSocial(String razaoSocial) {
        this.razaoSocial = razaoSocial;
    }

    public String getNomeFantasia() {
        return nomeFantasia;
    }

    public void setNomeFantasia(String nomeFantasia) {
        this.nomeFantasia = nomeFantasia;
    }

    public String getCnpj() {
        return cnpj;
    }

    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }

    public String getContatoNome() {
        return contatoNome;
    }

    public void setContatoNome(String contatoNome) {
        this.contatoNome = contatoNome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getCidade() {
        return cidade;
    }

    public void setCidade(String cidade) {
        this.cidade = cidade;
    }

    public String getUf() {
        return uf;
    }

    public void setUf(String uf) {
        this.uf = uf;
    }

    public Integer getPrazoEntregaDias() {
        return prazoEntregaDias;
    }

    public void setPrazoEntregaDias(Integer prazoEntregaDias) {
        this.prazoEntregaDias = prazoEntregaDias;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<Marca> getMarcasFornecidas() {
        return marcasFornecidas;
    }

    public void setMarcasFornecidas(List<Marca> marcasFornecidas) {
        this.marcasFornecidas = marcasFornecidas;
    }
}
