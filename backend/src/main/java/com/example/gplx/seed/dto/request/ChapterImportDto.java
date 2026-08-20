package com.example.gplx.seed.dto.request;

public record ChapterImportDto(
        String code,
        String name,
        String description,
        Integer sortOrder
) {
}
