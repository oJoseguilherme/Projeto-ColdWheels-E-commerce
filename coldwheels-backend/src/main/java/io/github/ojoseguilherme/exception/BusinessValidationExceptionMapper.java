package io.github.ojoseguilherme.exception;

import java.time.LocalDateTime;

import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
public class BusinessValidationExceptionMapper
        implements ExceptionMapper<BusinessValidationException> {

    @Override
    public Response toResponse(BusinessValidationException exception) {
        ApiError error = new ApiError(
                Response.Status.BAD_REQUEST.getStatusCode(),
                "Regra de negócio inválida",
                exception.getMessage(),
                LocalDateTime.now()
        );

        return Response.status(Response.Status.BAD_REQUEST)
                .type(MediaType.APPLICATION_JSON)
                .entity(error)
                .build();
    }
}