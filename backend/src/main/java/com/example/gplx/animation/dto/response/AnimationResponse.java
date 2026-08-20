package com.example.gplx.animation.dto.response;

import com.fasterxml.jackson.databind.JsonNode;

public record AnimationResponse(
        Long id,
        Long questionId,
        Integer sceneWidth,
        Integer sceneHeight,
        String backgroundImageUrl,
        Integer durationMs,
        JsonNode animationData
) {
}
