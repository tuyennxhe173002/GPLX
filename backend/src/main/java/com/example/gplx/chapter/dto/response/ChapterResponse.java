package com.example.gplx.chapter.dto.response;

public record ChapterResponse(
        Long id,
        String code,
        String name,
        String description,
        Integer sortOrder
) {
}
