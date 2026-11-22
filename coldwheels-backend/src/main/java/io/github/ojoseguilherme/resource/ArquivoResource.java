package io.github.ojoseguilherme.resource;

import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import io.github.ojoseguilherme.model.Arquivo;
import io.github.ojoseguilherme.service.ArquivoService;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.QueryParam;
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
    @Path("/assets/{path: .+}")
    @Operation(summary = "Recupera imagem estática ou de catálogo armazenada no Object Storage S3")
    public Response visualizarAsset(@PathParam("path") String path, @QueryParam("download") boolean download) {
        ResponseInputStream<GetObjectResponse> s3Stream = arquivoService.abrirAsset(path);
        GetObjectResponse meta = s3Stream.response();

        StreamingOutput output = os -> {
            try (s3Stream) {
                s3Stream.transferTo(os);
            }
        };

        String contentType = meta.contentType();
        if (contentType == null || contentType.isBlank()) {
            contentType = path.toLowerCase().endsWith(".webp") ? "image/webp" : "application/octet-stream";
        }

        CacheControl cache = new CacheControl();
        cache.setMaxAge(86400);

        Response.ResponseBuilder builder = Response.ok(output, contentType)
                .cacheControl(cache);
        if (download) {
            String nome = path.substring(path.lastIndexOf('/') + 1).replaceAll("[^a-zA-Z0-9._-]", "_");
            builder.header("Content-Disposition", "attachment; filename=\"" + nome + "\"");
        }
        if (meta.contentLength() != null) {
            builder.header("Content-Length", meta.contentLength());
        }
        return builder.build();
    }

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
