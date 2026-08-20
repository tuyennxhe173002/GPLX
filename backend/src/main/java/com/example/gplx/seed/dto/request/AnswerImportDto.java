package com.example.gplx.seed.dto.request;

public record AnswerImportDto(
        String label,
        String content,
        Boolean isCorrect
) {
}
