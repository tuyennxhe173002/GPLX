package com.example.gplx.explanationvideo.dto.response;

public record ExplanationVideoResponse(
        Long id,
        Long questionId,
        Integer questionNumber,
        String provider,
        String sourceUrl,
        String externalFileId,
        String embedUrl,
        String title,
        Boolean isActive
) {
}
