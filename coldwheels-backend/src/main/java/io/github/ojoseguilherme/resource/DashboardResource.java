package io.github.ojoseguilherme.resource;

import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import io.github.ojoseguilherme.service.DashboardService;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/dashboard")
@Produces(MediaType.APPLICATION_JSON)
@Tag(name = "Dashboard", description = "Endpoints para métricas e dados consolidados da Home")
public class DashboardResource {

    @Inject
    DashboardService service;

    @GET
    @Path("/metricas")
    @Operation(summary = "Retorna métricas consolidadas de vendas, usuários, pedidos e estoque")
    public Response getMetricas() {
        return Response.ok(service.getMetricas()).build();
    }

    @GET
    @Path("/estoque-baixo")
    @Operation(summary = "Retorna lista de produtos com estoque em nível crítico")
    public Response getProdutosEstoqueBaixo() {
        return Response.ok(service.getProdutosEstoqueBaixo()).build();
    }

    @GET
    @Path("/pedidos-recentes")
    @Operation(summary = "Retorna os últimos pedidos realizados")
    public Response getPedidosRecentes() {
        return Response.ok(service.getPedidosRecentes()).build();
    }
}
