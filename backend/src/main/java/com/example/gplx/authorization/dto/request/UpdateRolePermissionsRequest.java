package com.example.gplx.authorization.dto.request;

import jakarta.validation.constraints.NotNull;
import java.util.List;

public record UpdateRolePermissionsRequest(
        @NotNull(message = "Permissions list must not be null")
        List<String> permissions
) {
}
