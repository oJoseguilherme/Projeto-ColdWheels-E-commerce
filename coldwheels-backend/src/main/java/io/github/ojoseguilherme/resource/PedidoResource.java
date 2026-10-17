package io.github.ojoseguilherme.resource;

import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import io.github.ojoseguilherme.dto.PedidoRequestDTO;
import io.github.ojoseguilherme.dto.StatusPedidoRequestDTO;
import io.github.ojoseguilherme.service.PedidoService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PATCH;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;

@Path("/pedidos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Pedidos", description = "Endpoints para gerenciamento de pedidos e vendas")
public class PedidoResource {

    @Inject
    PedidoService service;

    @GET
    @Operation(summary = "Lista todos os pedidos com suporte a filtros")
    public Response listarTodos(
            @QueryParam("termo") String termo,
            @QueryParam("status") String status) {
        return Response.ok(service.listarTodos(termo, status)).build();
    }

    @GET
    @Path("/{id}")
    @Operation(summary = "Busca um pedido por ID com seus itens")
    public Response buscarPorId(@PathParam("id") Long id) {
        return Response.ok(service.buscarPorId(id)).build();
    }

    @POST
    @Operation(summary = "Cadastra um novo pedido com itens")
    public Response criar(@Valid PedidoRequestDTO dto) {
        return Response.status(Status.CREATED).entity(service.criar(dto)).build();
    }

    @PATCH
    @Path("/{id}/status")
    @Operation(summary = "Atualiza o status de um pedido")
    public Response atualizarStatus(@PathParam("id") Long id, @Valid StatusPedidoRequestDTO dto) {
        return Response.ok(service.atualizarStatus(id, dto)).build();
    }
}
