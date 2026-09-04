package com.example.gplx.authorization.dto.response;

import com.example.gplx.user.entity.UserRole;
import java.util.List;

public record RolePermissionsResponse(
        UserRole role,
        List<String> permissions
) {
}
