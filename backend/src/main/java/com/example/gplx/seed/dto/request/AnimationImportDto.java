package com.example.gplx.seed.dto.request;

import com.fasterxml.jackson.databind.JsonNode;

public record AnimationImportDto(
        Integer questionNumber,
        Integer sceneWidth,
        Integer sceneHeight,
        String backgroundImageUrl,
        Integer durationMs,
        JsonNode animationData
) {
}
