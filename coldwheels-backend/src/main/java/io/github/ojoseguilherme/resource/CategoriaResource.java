package io.github.ojoseguilherme.resource;

import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import io.github.ojoseguilherme.dto.CategoriaRequestDTO;
import io.github.ojoseguilherme.mapper.CategoriaMapper;
import io.github.ojoseguilherme.model.Categoria;
import io.github.ojoseguilherme.service.CategoriaService;
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

@Path("/categorias")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Categorias", description = "Endpoints para gerenciamento de categorias")
public class CategoriaResource {

    @Inject
    CategoriaService service;

    @GET
    public Response buscarTodas() {
        return Response.ok(service.findAll().stream().map(CategoriaMapper::toResponseDTO).toList()).build();
    }

    @GET
    @Path("/{id}")
    public Response buscarPorId(@PathParam("id") Long id) {
        Categoria categoria = service.findById(id);
        if (categoria == null) {
            return Response.status(Status.NOT_FOUND).build();
        }
        return Response.ok(CategoriaMapper.toResponseDTO(categoria)).build();
    }

    @GET
    @Path("/find/{nome}")
    public Response buscarPorNome(@PathParam("nome") String nome) {
        return Response.ok(service.findByNome(nome).stream().map(CategoriaMapper::toResponseDTO).toList()).build();
    }

    @POST
    public Response incluir(@Valid CategoriaRequestDTO dto) {
        Categoria categoria = service.create(CategoriaMapper.toEntity(dto));
        return Response.status(Status.CREATED).entity(CategoriaMapper.toResponseDTO(categoria)).build();
    }

    @PUT
    @Path("/{id}")
    public Response alterar(@PathParam("id") Long id, @Valid CategoriaRequestDTO dto) {
        service.update(id, CategoriaMapper.toEntity(dto));
        return Response.noContent().build();
    }

    @DELETE
    @Path("/{id}")
    public Response deletar(@PathParam("id") Long id) {
        service.delete(id);
        return Response.noContent().build();
    }
}
