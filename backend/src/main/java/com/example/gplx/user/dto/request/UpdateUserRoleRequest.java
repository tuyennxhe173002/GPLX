package com.example.gplx.user.dto.request;

import com.example.gplx.user.entity.UserRole;
import jakarta.validation.constraints.NotNull;

public record UpdateUserRoleRequest(
        @NotNull(message = "Role must not be null")
        UserRole role
) {
}
