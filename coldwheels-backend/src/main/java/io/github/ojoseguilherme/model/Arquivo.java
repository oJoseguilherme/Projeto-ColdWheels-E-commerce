package io.github.ojoseguilherme.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;

@Entity
public class Arquivo extends DefaultEntity {

    @Column(name = "object_key", length = 255, nullable = false, unique = true)
    private String objectKey;

    @Column(name = "nome_original", length = 255, nullable = false)
    private String nomeOriginal;

    @Column(name = "content_type", length = 100, nullable = false)
    private String contentType;

    @Column(name = "tamanho_bytes", nullable = false)
    private Long tamanhoBytes;

    public String getObjectKey() {
        return objectKey;
    }

    public void setObjectKey(String objectKey) {
        this.objectKey = objectKey;
    }

    public String getNomeOriginal() {
        return nomeOriginal;
    }

    public void setNomeOriginal(String nomeOriginal) {
        this.nomeOriginal = nomeOriginal;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public Long getTamanhoBytes() {
        return tamanhoBytes;
    }

    public void setTamanhoBytes(Long tamanhoBytes) {
        this.tamanhoBytes = tamanhoBytes;
    }
}
