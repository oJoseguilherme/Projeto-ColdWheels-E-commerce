package io.github.ojoseguilherme.resource;

import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import io.github.ojoseguilherme.dto.FornecedorRequestDTO;
import io.github.ojoseguilherme.service.FornecedorService;
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

@Path("/fornecedores")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Fornecedores", description = "Endpoints para gerenciamento de fornecedores industriais")
public class FornecedorResource {

    @Inject
    FornecedorService service;

    @GET
    @Operation(summary = "Lista todos os fornecedores homologados")
    public Response buscarTodos() {
        return Response.ok(service.findAll()).build();
    }

    @GET
    @Path("/resumo")
    @Operation(summary = "Retorna o resumo operacional de fornecedores")
    public Response getResumo() {
        return Response.ok(service.getResumo()).build();
    }

    @GET
    @Path("/{id}")
    @Operation(summary = "Busca fornecedor por ID")
    public Response buscarPorId(@PathParam("id") Long id) {
        return Response.ok(service.findById(id)).build();
    }

    @POST
    @Operation(summary = "Cadastra um novo fornecedor")
    public Response incluir(@Valid FornecedorRequestDTO dto) {
        return Response.status(Status.CREATED).entity(service.create(dto)).build();
    }

    @PUT
    @Path("/{id}")
    @Operation(summary = "Atualiza fornecedor existente")
    public Response alterar(@PathParam("id") Long id, @Valid FornecedorRequestDTO dto) {
        return Response.ok(service.update(id, dto)).build();
    }

    @DELETE
    @Path("/{id}")
    @Operation(summary = "Exclui um fornecedor")
    public Response deletar(@PathParam("id") Long id) {
        service.delete(id);
        return Response.noContent().build();
    }
}
