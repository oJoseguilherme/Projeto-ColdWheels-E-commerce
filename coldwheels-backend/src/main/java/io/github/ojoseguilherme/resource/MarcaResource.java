package io.github.ojoseguilherme.resource;

import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import io.github.ojoseguilherme.dto.MarcaRequestDTO;
import io.github.ojoseguilherme.service.MarcaService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;

@Path("/marcas")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Marcas", description = "Endpoints para gerenciamento de marcas licenciadas")
public class MarcaResource {

    @Inject
    MarcaService service;

    @GET
    @Operation(summary = "Lista todas as marcas cadastradas")
    public Response buscarTodas() {
        return Response.ok(service.findAll()).build();
    }

    @GET
    @Path("/resumo")
    @Operation(summary = "Retorna métricas consolidadas das marcas")
    public Response getResumo() {
        return Response.ok(service.getResumo()).build();
    }

    @GET
    @Path("/{id}")
    @Operation(summary = "Busca uma marca por ID")
    public Response buscarPorId(@PathParam("id") Long id) {
        return Response.ok(service.findById(id)).build();
    }

    @POST
    @Operation(summary = "Cadastra uma nova marca")
    public Response incluir(@Valid MarcaRequestDTO dto) {
        return Response.status(Status.CREATED).entity(service.create(dto)).build();
    }

    @PUT
    @Path("/{id}")
    @Operation(summary = "Atualiza uma marca existente")
    public Response alterar(@PathParam("id") Long id, @Valid MarcaRequestDTO dto) {
        return Response.ok(service.update(id, dto)).build();
    }

    @DELETE
    @Path("/{id}")
    @Operation(summary = "Exclui uma marca")
    public Response deletar(@PathParam("id") Long id) {
        service.delete(id);
        return Response.noContent().build();
    }
}
