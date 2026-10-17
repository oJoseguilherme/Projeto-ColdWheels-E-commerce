package io.github.ojoseguilherme.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;

@Entity
public class Marca extends DefaultEntity {

    @Column(length = 100, nullable = false, unique = true)
    private String nome;

    @Column(name = "pais_origem", length = 100, nullable = false)
    private String paisOrigem;

    @Column(name = "bandeira_pais", length = 20)
    private String bandeiraPais;

    @Column(name = "logo_url", length = 500)
    private String logoUrl;

    @Column(length = 20, nullable = false)
    private String status; // 'ATIVA', 'INATIVA'

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getPaisOrigem() {
        return paisOrigem;
    }

    public void setPaisOrigem(String paisOrigem) {
        this.paisOrigem = paisOrigem;
    }

    public String getBandeiraPais() {
        return bandeiraPais;
    }

    public void setBandeiraPais(String bandeiraPais) {
        this.bandeiraPais = bandeiraPais;
    }

    public String getLogoUrl() {
        return logoUrl;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
