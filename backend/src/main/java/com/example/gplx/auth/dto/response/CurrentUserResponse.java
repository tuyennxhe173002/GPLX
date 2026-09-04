package com.example.gplx.auth.dto.response;

import com.example.gplx.user.entity.UserRole;
import com.example.gplx.user.entity.UserStatus;
import java.time.Instant;
import java.util.List;

public record CurrentUserResponse(
        Long id,
        String email,
        String fullName,
        UserRole role,
        UserStatus status,
        Boolean mustChangePassword,
        List<String> permissions,
        Instant createdAt,
        Instant lastLoginAt
) {
}
