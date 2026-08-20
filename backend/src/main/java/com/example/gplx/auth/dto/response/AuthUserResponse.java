package com.example.gplx.auth.dto.response;

public record AuthUserResponse(
        Long id,
        String email,
        String fullName
) {
}
