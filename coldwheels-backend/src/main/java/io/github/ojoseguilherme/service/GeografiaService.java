package io.github.ojoseguilherme.service;

import java.util.List;

import io.github.ojoseguilherme.dto.EstadoResponseDTO;
import io.github.ojoseguilherme.dto.MunicipioResponseDTO;

public interface GeografiaService {

    List<EstadoResponseDTO> findEstados();

    List<MunicipioResponseDTO> findMunicipiosByUf(String uf);

    MunicipioResponseDTO findMunicipioByCodigoIbge(String codigoIbge);
}