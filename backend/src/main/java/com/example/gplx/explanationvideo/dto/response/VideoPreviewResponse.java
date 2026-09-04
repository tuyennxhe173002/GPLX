package com.example.gplx.explanationvideo.dto.response;

public record VideoPreviewResponse(
        String externalFileId,
        String embedUrl,
        String provider
) {
}
