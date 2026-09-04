package com.example.gplx.user.dto.request;

import com.example.gplx.user.entity.UserStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateUserStatusRequest(
        @NotNull(message = "Status must not be null")
        UserStatus status
) {
}
