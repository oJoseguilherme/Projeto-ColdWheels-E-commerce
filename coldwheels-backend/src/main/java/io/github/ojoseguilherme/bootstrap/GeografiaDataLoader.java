package io.github.ojoseguilherme.bootstrap;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

import org.jboss.logging.Logger;

import io.github.ojoseguilherme.model.Estado;
import io.github.ojoseguilherme.model.Municipio;
import io.github.ojoseguilherme.repository.EstadoRepository;
import io.github.ojoseguilherme.repository.MunicipioRepository;
import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class GeografiaDataLoader {

    private static final Logger LOG = Logger.getLogger(GeografiaDataLoader.class);

    private static final String ESTADOS_CSV = "data/geografia/estados.csv";
    private static final String MUNICIPIOS_CSV = "data/geografia/municipios.csv";

    @Inject
    EstadoRepository estadoRepository;

    @Inject
    MunicipioRepository municipioRepository;

    @Transactional
    void carregarDados(@Observes StartupEvent event) {
        try {
            Map<String, Estado> estadosPorCodigo = carregarEstados();
            carregarMunicipios(estadosPorCodigo);
        } catch (IOException e) {
            throw new IllegalStateException(
                    "Não foi possível carregar a base geográfica.",
                    e);
        }
    }

    private Map<String, Estado> carregarEstados() throws IOException {
        Map<String, Estado> estadosPorCodigo = new HashMap<>();

        for (Estado estado : estadoRepository.listAll()) {
            estadosPorCodigo.put(estado.getCodigoIbge(), estado);
        }

        int inseridos = 0;
        int atualizados = 0;

        try (BufferedReader reader = abrirCsv(ESTADOS_CSV)) {
            validarCabecalho(
                    reader.readLine(),
                    "codigo_ibge;sigla;nome",
                    ESTADOS_CSV);

            String linha;
            int numeroLinha = 1;

            while ((linha = reader.readLine()) != null) {
                numeroLinha++;

                if (linha.isBlank()) {
                    continue;
                }

                String[] campos = separarCampos(
                        linha,
                        3,
                        ESTADOS_CSV,
                        numeroLinha);

                String codigoIbge = campos[0].trim();
                String sigla = campos[1].trim();
                String nome = campos[2].trim();

                validarEstado(codigoIbge, sigla, nome, numeroLinha);

                Estado estado = estadosPorCodigo.get(codigoIbge);

                if (estado == null) {
                    estado = new Estado();
                    estado.setCodigoIbge(codigoIbge);
                    estado.setSigla(sigla);
                    estado.setNome(nome);

                    estadoRepository.persist(estado);
                    estadosPorCodigo.put(codigoIbge, estado);

                    inseridos++;
                    continue;
                }

                boolean alterado = false;

                if (!estado.getSigla().equals(sigla)) {
                    estado.setSigla(sigla);
                    alterado = true;
                }

                if (!estado.getNome().equals(nome)) {
                    estado.setNome(nome);
                    alterado = true;
                }

                if (alterado) {
                    atualizados++;
                }
            }
        }

        LOG.infof(
                "Base geográfica: %d estado(s) inserido(s) e %d atualizado(s).",
                inseridos,
                atualizados);

        return estadosPorCodigo;
    }

    private void carregarMunicipios(
            Map<String, Estado> estadosPorCodigo) throws IOException {

        Map<String, Municipio> municipiosPorCodigo = new HashMap<>();

        for (Municipio municipio : municipioRepository.listAll()) {
            municipiosPorCodigo.put(
                    municipio.getCodigoIbge(),
                    municipio);
        }

        int inseridos = 0;
        int atualizados = 0;

        try (BufferedReader reader = abrirCsv(MUNICIPIOS_CSV)) {
            validarCabecalho(
                    reader.readLine(),
                    "codigo_ibge;nome;codigo_estado",
                    MUNICIPIOS_CSV);

            String linha;
            int numeroLinha = 1;

            while ((linha = reader.readLine()) != null) {
                numeroLinha++;

                if (linha.isBlank()) {
                    continue;
                }

                String[] campos = separarCampos(
                        linha,
                        3,
                        MUNICIPIOS_CSV,
                        numeroLinha);

                String codigoIbge = campos[0].trim();
                String nome = campos[1].trim();
                String codigoEstado = campos[2].trim();

                validarMunicipio(
                        codigoIbge,
                        nome,
                        codigoEstado,
                        numeroLinha);

                Estado estado = estadosPorCodigo.get(codigoEstado);

                if (estado == null) {
                    throw new IllegalStateException(
                            "Estado de código IBGE "
                                    + codigoEstado
                                    + " não encontrado para o município "
                                    + codigoIbge
                                    + ".");
                }

                Municipio municipio = municipiosPorCodigo.get(codigoIbge);

                if (municipio == null) {
                    municipio = new Municipio();
                    municipio.setCodigoIbge(codigoIbge);
                    municipio.setNome(nome);
                    municipio.setEstado(estado);

                    municipioRepository.persist(municipio);
                    municipiosPorCodigo.put(codigoIbge, municipio);

                    inseridos++;
                    continue;
                }

                if (!municipio.getNome().equals(nome)) {
                    municipio.setNome(nome);
                    atualizados++;
                }
            }
        }

        LOG.infof(
                "Base geográfica: %d município(s) inserido(s) e %d atualizado(s).",
                inseridos,
                atualizados);
    }

    private BufferedReader abrirCsv(String caminho) {
        InputStream inputStream = Thread.currentThread()
                .getContextClassLoader()
                .getResourceAsStream(caminho);

        if (inputStream == null) {
            throw new IllegalStateException(
                    "Arquivo de dados não encontrado: " + caminho);
        }

        return new BufferedReader(
                new InputStreamReader(
                        inputStream,
                        StandardCharsets.UTF_8));
    }

    private void validarCabecalho(
            String atual,
            String esperado,
            String arquivo) {

        if (!esperado.equals(atual)) {
            throw new IllegalStateException(
                    "Cabeçalho inválido no arquivo "
                            + arquivo
                            + ". Esperado: "
                            + esperado);
        }
    }

    private String[] separarCampos(
            String linha,
            int quantidadeEsperada,
            String arquivo,
            int numeroLinha) {

        String[] campos = linha.split(";", -1);

        if (campos.length != quantidadeEsperada) {
            throw new IllegalStateException(
                    "Linha "
                            + numeroLinha
                            + " inválida em "
                            + arquivo
                            + ".");
        }

        return campos;
    }

    private void validarEstado(
            String codigoIbge,
            String sigla,
            String nome,
            int numeroLinha) {

        if (!codigoIbge.matches("\\d{2}")) {
            throw new IllegalStateException(
                    "Código IBGE de Estado inválido na linha "
                            + numeroLinha
                            + ".");
        }

        if (!sigla.matches("[A-Z]{2}")) {
            throw new IllegalStateException(
                    "Sigla de Estado inválida na linha "
                            + numeroLinha
                            + ".");
        }

        if (nome.isBlank()) {
            throw new IllegalStateException(
                    "Nome de Estado vazio na linha "
                            + numeroLinha
                            + ".");
        }
    }

    private void validarMunicipio(
            String codigoIbge,
            String nome,
            String codigoEstado,
            int numeroLinha) {

        if (!codigoIbge.matches("\\d{7}")) {
            throw new IllegalStateException(
                    "Código IBGE de Município inválido na linha "
                            + numeroLinha
                            + ".");
        }

        if (nome.isBlank()) {
            throw new IllegalStateException(
                    "Nome de Município vazio na linha "
                            + numeroLinha
                            + ".");
        }

        if (!codigoEstado.matches("\\d{2}")) {
            throw new IllegalStateException(
                    "Código IBGE de Estado inválido na linha "
                            + numeroLinha
                            + ".");
        }
    }
}