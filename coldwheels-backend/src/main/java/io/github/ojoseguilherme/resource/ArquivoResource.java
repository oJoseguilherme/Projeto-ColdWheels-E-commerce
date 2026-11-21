package io.github.ojoseguilherme.resource;

import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import io.github.ojoseguilherme.model.Arquivo;
import io.github.ojoseguilherme.service.ArquivoService;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.core.CacheControl;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.StreamingOutput;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;

@Path("/arquivos")
@Tag(
    name = "Arquivos",
    description = "Endpoints para visualização e download de arquivos armazenados no Object Storage S3"
)
public class ArquivoResource {

    @Inject
    ArquivoService arquivoService;

    @GET
    @Path("/{id}")
    @Operation(summary = "Recupera o arquivo para exibição inline")
    public Response visualizar(@PathParam("id") Long id) {
        Arquivo arquivo = arquivoService.findById(id);
        ResponseInputStream<GetObjectResponse> s3Stream = arquivoService.abrirStream(arquivo);

        StreamingOutput output = os -> {
            try (s3Stream) {
                s3Stream.transferTo(os);
            }
        };

        CacheControl cache = new CacheControl();
        cache.setMaxAge(3600);

        return Response.ok(output, arquivo.getContentType())
                .header("Content-Length", arquivo.getTamanhoBytes())
                .header("Content-Disposition", "inline; filename=\"" + arquivo.getNomeOriginal() + "\"")
                .cacheControl(cache)
                .build();
    }

    @GET
    @Path("/{id}/download")
    @Operation(summary = "Faz o download do arquivo como anexo")
    public Response baixar(@PathParam("id") Long id) {
        Arquivo arquivo = arquivoService.findById(id);
        ResponseInputStream<GetObjectResponse> s3Stream = arquivoService.abrirStream(arquivo);

        StreamingOutput output = os -> {
            try (s3Stream) {
                s3Stream.transferTo(os);
            }
        };

        return Response.ok(output, arquivo.getContentType())
                .header("Content-Length", arquivo.getTamanhoBytes())
                .header("Content-Disposition", "attachment; filename=\"" + arquivo.getNomeOriginal() + "\"")
                .build();
    }
}
