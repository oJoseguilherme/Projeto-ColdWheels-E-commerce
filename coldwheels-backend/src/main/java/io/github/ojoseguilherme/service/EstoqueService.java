package io.github.ojoseguilherme.service;

import java.util.List;

import io.github.ojoseguilherme.dto.AjusteEstoqueRequestDTO;
import io.github.ojoseguilherme.dto.ItemEstoqueDTO;
import io.github.ojoseguilherme.dto.ResumoEstoqueDTO;

public interface EstoqueService {

    List<ItemEstoqueDTO> listarTodos(String termo, String filtro);

    ResumoEstoqueDTO getResumo();

    ItemEstoqueDTO ajustarEstoque(String tipo, Long id, AjusteEstoqueRequestDTO dto);
}
