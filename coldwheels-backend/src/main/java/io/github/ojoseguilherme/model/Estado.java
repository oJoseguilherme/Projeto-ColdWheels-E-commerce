package io.github.ojoseguilherme.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;

@Entity
public class Estado extends DefaultEntity {

    @Column(name = "codigo_ibge", length = 2, nullable = false, unique = true)
    private String codigoIbge;

    @Column(length = 100, nullable = false)
    private String nome;

    @Column(length = 2, nullable = false, unique = true)
    private String sigla;

    public String getCodigoIbge() {
        return codigoIbge;
    }

    public void setCodigoIbge(String codigoIbge) {
        this.codigoIbge = codigoIbge;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getSigla() {
        return sigla;
    }

    public void setSigla(String sigla) {
        this.sigla = sigla;
    }
}