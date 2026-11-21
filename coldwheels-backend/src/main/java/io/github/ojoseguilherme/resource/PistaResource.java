package io.github.ojoseguilherme.resource;

import java.io.IOException;
import java.nio.file.Files;

import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import org.jboss.resteasy.reactive.RestForm;
import org.jboss.resteasy.reactive.multipart.FileUpload;

import io.github.ojoseguilherme.dto.PistaRequestDTO;
import io.github.ojoseguilherme.exception.BusinessValidationException;
import io.github.ojoseguilherme.service.ArquivoService;
import io.github.ojoseguilherme.service.PistaService;
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

@Path("/pistas")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(
    name = "Pistas",
    description = "Endpoints para gerenciamento de pistas do ColdWheels"
)
public class PistaResource {

    @Inject
    PistaService service;

    @Inject
    ArquivoService arquivoService;

    @GET
    @Operation(summary = "Lista todas as pistas")
    public Response buscarTodos() {
        return Response.ok(service.findAll()).build();
    }

    @GET
    @Path("/{id}")
    @Operation(summary = "Busca uma pista pelo ID")
    public Response buscarPorId(@PathParam("id") Long id) {
        return Response.ok(service.findById(id)).build();
    }

    @POST
    @Operation(summary = "Cadastra uma nova pista")
    public Response incluir(@Valid PistaRequestDTO dto) {
        return Response.status(Response.Status.CREATED)
                .entity(service.create(dto))
                .build();
    }

    @PUT
    @Path("/{id}")
    @Operation(summary = "Atualiza uma pista existente")
    public Response alterar(
            @PathParam("id") Long id,
            @Valid PistaRequestDTO dto) {

        return Response.ok(service.update(id, dto)).build();
    }

    @DELETE
    @Path("/{id}")
    @Operation(summary = "Exclui uma pista")
    public Response deletar(@PathParam("id") Long id) {
        service.delete(id);
        return Response.noContent().build();
    }

    @POST
    @Path("/{id}/imagens/{slot}")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Operation(summary = "Faz upload de imagem (principal ou secundaria) para uma pista")
    public Response uploadImagem(
            @PathParam("id") Long id,
            @PathParam("slot") String slot,
            @RestForm("arquivo") FileUpload arquivo) {

        if (arquivo == null || arquivo.uploadedFile() == null) {
            throw new BusinessValidationException("Nenhum arquivo foi enviado.");
        }

        try {
            byte[] bytes = arquivoService.lerBytesLimitados(Files.newInputStream(arquivo.uploadedFile()));
            return Response.ok(
                    service.atualizarImagem(id, slot, arquivo.fileName(), arquivo.contentType(), bytes)
            ).build();
        } catch (IOException e) {
            throw new BusinessValidationException("Não foi possível ler o arquivo enviado.");
        }
    }

    @DELETE
    @Path("/{id}/imagens/{slot}")
    @Operation(summary = "Remove a imagem (principal ou secundaria) de uma pista")
    public Response removerImagem(
            @PathParam("id") Long id,
            @PathParam("slot") String slot) {

        return Response.ok(service.removerImagem(id, slot)).build();
    }
}