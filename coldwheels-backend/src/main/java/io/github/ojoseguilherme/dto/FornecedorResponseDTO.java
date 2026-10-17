package io.github.ojoseguilherme.dto;

import java.time.LocalDateTime;
import java.util.List;

public record FornecedorResponseDTO(
    Long id,
    String razaoSocial,
    String nomeFantasia,
    String cnpj,
    String contatoNome,
    String email,
    String telefone,
    String cidade,
    String uf,
    Integer prazoEntregaDias,
    String status,
    List<String> marcasFornecidas,
    long totalProdutosFornecidos,
    LocalDateTime dataCadastro
) {
}
