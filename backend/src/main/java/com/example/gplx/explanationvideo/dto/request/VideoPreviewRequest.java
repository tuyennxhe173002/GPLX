package com.example.gplx.explanationvideo.dto.request;

import jakarta.validation.constraints.NotBlank;

public record VideoPreviewRequest(
        @NotBlank(message = "driveUrl is required")
        String driveUrl
) {
}
