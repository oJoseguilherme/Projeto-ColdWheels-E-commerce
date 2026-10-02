package io.github.ojoseguilherme.resource;

import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import io.github.ojoseguilherme.service.GeografiaService;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/geografia")
@Produces(MediaType.APPLICATION_JSON)
@Tag(
    name = "Geografia",
    description = "Consultas de Estados e Municípios"
)
public class GeografiaResource {

    @Inject
    GeografiaService service;

    @GET
    @Path("/estados")
    @Operation(summary = "Lista os Estados disponíveis")
    public Response buscarEstados() {
        return Response.ok(service.findEstados()).build();
    }

    @GET
    @Path("/municipios")
    @Operation(summary = "Lista os Municípios de uma UF")
    public Response buscarMunicipiosPorUf(
            @QueryParam("uf") String uf) {

        return Response.ok(
            service.findMunicipiosByUf(uf)
        ).build();
    }

    @GET
    @Path("/municipios/ibge/{codigoIbge}")
    @Operation(summary = "Busca um Município pelo código IBGE")
    public Response buscarMunicipioPorCodigoIbge(
            @PathParam("codigoIbge") String codigoIbge) {

        return Response.ok(
            service.findMunicipioByCodigoIbge(codigoIbge)
        ).build();
    }
}