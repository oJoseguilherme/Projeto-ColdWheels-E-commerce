package io.github.ojoseguilherme.resource;

import java.util.List;

import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import io.github.ojoseguilherme.dto.CarrinhoRequestDTO;
import io.github.ojoseguilherme.dto.CarrinhoResponseDTO;
import io.github.ojoseguilherme.dto.PageResponse;
import io.github.ojoseguilherme.mapper.CarrinhoMapper;
import io.github.ojoseguilherme.model.Carrinho;
import io.github.ojoseguilherme.service.CarrinhoService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;

@Path("/carrinhos") 
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Carrinhos", description = "Endpoints para gerenciamento de ColdWheels")
public class CarrinhoResource {

    @Inject
    CarrinhoService service;

    @GET
    @Operation(summary = "Lista carrinhos com paginação e suporte a filtro por nome e/ou idCategoria")
    public PageResponse<CarrinhoResponseDTO> buscarTodos(
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("pageSize") @DefaultValue("8") int pageSize,
            @QueryParam("nome") String nome,
            @QueryParam("idCategoria") Long idCategoria) {

        List<Carrinho> carrinhos = service.findByFiltro(nome, idCategoria, page, pageSize);
        long totalItems = service.count(nome, idCategoria);

        return PageResponse.of(carrinhos, page, pageSize, totalItems, CarrinhoMapper::toResponseDTO);
    }

    @GET
    @Path("/todos")
    @Operation(summary = "Lista todos os carrinhos sem paginação")
    public Response buscarTodosSemPaginacao() {
        return Response.ok(service.findAll().stream().map(CarrinhoMapper::toResponseDTO).toList()).build();
    }

    @GET 
    @Path("/{id}")
    @Operation(summary = "Busca um carrinho por ID")
    public Response buscarPorId(@PathParam("id") Long id) {
        Carrinho carrinho = service.findById(id);
        if (carrinho == null) {
            return Response.status(Status.NOT_FOUND).build();
        }
        return Response.ok(CarrinhoMapper.toResponseDTO(carrinho)).build();
    }

    @POST 
    @Operation(summary = "Cadastra um novo carrinho")
    public Response incluir(@Valid CarrinhoRequestDTO dto) {
        Carrinho carrinho = service.create(CarrinhoMapper.toEntity(dto));
        return Response.status(Status.CREATED).entity(CarrinhoMapper.toResponseDTO(carrinho)).build();
    }

    @PUT 
    @Path("/{id}")
    @Operation(summary = "Atualiza um carrinho existente")
    public Response alterar(@PathParam("id") Long id, @Valid CarrinhoRequestDTO dto) {
        service.update(id, CarrinhoMapper.toEntity(dto));
        return Response.noContent().build();
    }

    @DELETE 
    @Path("/{id}")
    @Operation(summary = "Exclui um carrinho")
    public Response deletar(@PathParam("id") Long id) {
        service.delete(id);
        return Response.noContent().build();
    }
}
