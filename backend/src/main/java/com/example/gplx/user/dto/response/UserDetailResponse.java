package com.example.gplx.user.dto.response;

import com.example.gplx.user.entity.UserRole;
import com.example.gplx.user.entity.UserStatus;
import java.time.Instant;
import java.util.List;

public record UserDetailResponse(
        Long id,
        String email,
        String fullName,
        UserRole role,
        UserStatus status,
        Boolean mustChangePassword,
        Instant createdAt,
        Instant updatedAt,
        Instant lastLoginAt,
        List<String> permissions
) {
}
