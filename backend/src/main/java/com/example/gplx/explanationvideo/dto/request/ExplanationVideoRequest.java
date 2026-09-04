package com.example.gplx.explanationvideo.dto.request;

import jakarta.validation.constraints.NotBlank;

public record ExplanationVideoRequest(
        @NotBlank(message = "driveUrl is required")
        String driveUrl,

        String title,

        Boolean isActive
) {
}
