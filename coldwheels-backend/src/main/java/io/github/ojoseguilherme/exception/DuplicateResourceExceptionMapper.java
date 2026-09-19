package io.github.ojoseguilherme.exception;

import java.time.LocalDateTime;

import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
public class DuplicateResourceExceptionMapper
        implements ExceptionMapper<DuplicateResourceException> {

    @Override
    public Response toResponse(DuplicateResourceException exception) {
        ApiError error = new ApiError(
                Response.Status.CONFLICT.getStatusCode(),
                "Conflito",
                exception.getMessage(),
                LocalDateTime.now()
        );

        return Response.status(Response.Status.CONFLICT)
                .type(MediaType.APPLICATION_JSON)
                .entity(error)
                .build();
    }
}