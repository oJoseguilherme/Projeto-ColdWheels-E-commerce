package io.github.ojoseguilherme.resource;

import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import io.github.ojoseguilherme.dto.AjusteEstoqueRequestDTO;
import io.github.ojoseguilherme.service.EstoqueService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PATCH;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/estoque")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Estoque", description = "Endpoints para visão unificada de inventário e ajuste de saldos")
public class EstoqueResource {

    @Inject
    EstoqueService service;

    @GET
    @Operation(summary = "Lista todos os itens em estoque (carrinhos e pistas unificados)")
    public Response listarTodos(
            @QueryParam("termo") String termo,
            @QueryParam("filtro") String filtro) {
        return Response.ok(service.listarTodos(termo, filtro)).build();
    }

    @GET
    @Path("/resumo")
    @Operation(summary = "Retorna o resumo consolidado de estoque")
    public Response getResumo() {
        return Response.ok(service.getResumo()).build();
    }

    @PATCH
    @Path("/{tipo}/{id}")
    @Operation(summary = "Ajusta o saldo em estoque de um item (CARRINHO ou PISTA)")
    public Response ajustarEstoque(
            @PathParam("tipo") String tipo,
            @PathParam("id") Long id,
            @Valid AjusteEstoqueRequestDTO dto) {
        return Response.ok(service.ajustarEstoque(tipo, id, dto)).build();
    }
}
