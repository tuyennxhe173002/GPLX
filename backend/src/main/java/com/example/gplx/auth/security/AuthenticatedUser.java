package com.example.gplx.auth.security;

public record AuthenticatedUser(
        Long id,
        String email
) {
}
