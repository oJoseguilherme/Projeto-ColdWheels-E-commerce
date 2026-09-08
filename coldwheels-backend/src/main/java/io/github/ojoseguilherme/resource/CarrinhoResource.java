package io.github.ojoseguilherme.resource;


import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import io.github.ojoseguilherme.dto.CarrinhoRequestDTO;
import io.github.ojoseguilherme.mapper.CarrinhoMapper;
import io.github.ojoseguilherme.model.Carrinho;
import io.github.ojoseguilherme.service.CarrinhoService;
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

@Path("/carrinhos") 
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name= "Carrinhos", description="Endpoints para gerenciamento de ColdWheels")
public class CarrinhoResource {

    @Inject
    CarrinhoService service;

    @GET 
    public Response buscarTodos(){
        return Response.ok(service.findAll().stream().map(CarrinhoMapper::toResponseDTO).toList()).build();
    }

    @GET 
@Path("/{id}")
public Response buscarPorId(@PathParam("id") Long id){
    Carrinho carrinho = service.findById(id);
    if (carrinho==null) {
        return Response.status(Status.NOT_FOUND).build();
    }
    return Response.ok(CarrinhoMapper.toResponseDTO(carrinho)).build();
}
    @GET 
    @Path("/find/{nome}")
    public Response buscarPorNome(@PathParam("nome") String nome){
        return Response.ok(service.findByNome(nome).stream().map(CarrinhoMapper::toResponseDTO).toList()).build();
    }

    @POST 
    public Response incluir(@Valid CarrinhoRequestDTO dto){
        Carrinho carrinho = service.create(CarrinhoMapper.toEntity(dto));
        return Response.status(Status.CREATED).entity(CarrinhoMapper.toResponseDTO(carrinho)).build();
    }

    @PUT 
    @Path("/{id}")
    public Response alterar(@PathParam ("id") Long id,@Valid CarrinhoRequestDTO dto){
        service.update(id, CarrinhoMapper.toEntity(dto));
        return Response.noContent().build();
    }

    @DELETE 
    @Path("/{id}")
    public Response deletar(@PathParam("id") Long id){
        service.delete(id);
        return Response.noContent().build();
    }


}

