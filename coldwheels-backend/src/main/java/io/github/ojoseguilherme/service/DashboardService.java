package io.github.ojoseguilherme.service;

import java.util.List;

import io.github.ojoseguilherme.dto.DashboardMetricasDTO;
import io.github.ojoseguilherme.dto.ItemEstoqueBaixoDTO;
import io.github.ojoseguilherme.dto.PedidoRecenteDTO;

public interface DashboardService {

    DashboardMetricasDTO getMetricas();

    List<ItemEstoqueBaixoDTO> getProdutosEstoqueBaixo();

    List<PedidoRecenteDTO> getPedidosRecentes();
}
