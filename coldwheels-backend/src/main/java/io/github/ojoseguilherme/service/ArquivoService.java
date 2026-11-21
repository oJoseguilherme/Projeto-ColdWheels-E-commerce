package io.github.ojoseguilherme.service;

import java.io.InputStream;

import io.github.ojoseguilherme.model.Arquivo;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;

public interface ArquivoService {

    Arquivo salvarImagem(String pastaPrefixo, String nomeOriginal, String contentType, byte[] conteudo);

    Arquivo findById(Long id);

    ResponseInputStream<GetObjectResponse> abrirStream(Arquivo arquivo);

    ResponseInputStream<GetObjectResponse> abrirAsset(String caminhoRelativo);

    void excluir(Arquivo arquivo);

    void validarImagem(String nomeOriginal, String contentType, byte[] conteudo);

    /**
     * Lê um InputStream respeitando o limite máximo permitido para evitar consumo excessivo de memória.
     */
    byte[] lerBytesLimitados(InputStream inputStream);
}
