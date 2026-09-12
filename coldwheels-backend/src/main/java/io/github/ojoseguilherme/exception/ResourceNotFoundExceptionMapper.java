package io.github.ojoseguilherme.exception;

import java.time.LocalDateTime;

import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
public class ResourceNotFoundExceptionMapper
        implements ExceptionMapper<ResourceNotFoundException> {

    @Override
    public Response toResponse(ResourceNotFoundException exception) {
        ApiError error = new ApiError(
                Response.Status.NOT_FOUND.getStatusCode(),
                "Recurso não encontrado",
                exception.getMessage(),
                LocalDateTime.now()
        );

        return Response.status(Response.Status.NOT_FOUND)
                .type(MediaType.APPLICATION_JSON)
                .entity(error)
                .build();
    }
}