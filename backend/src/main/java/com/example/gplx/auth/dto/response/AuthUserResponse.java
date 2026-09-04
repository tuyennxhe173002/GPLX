package com.example.gplx.auth.dto.response;

import com.example.gplx.user.entity.UserRole;
import java.util.List;

public record AuthUserResponse(
        Long id,
        String email,
        String fullName,
        UserRole role,
        List<String> permissions
) {
}
