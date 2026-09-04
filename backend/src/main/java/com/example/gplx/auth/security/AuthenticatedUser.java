package com.example.gplx.auth.security;

import com.example.gplx.user.entity.UserRole;
import java.util.List;

public record AuthenticatedUser(
        Long id,
        String email,
        UserRole role,
        List<String> permissions
) {
}
