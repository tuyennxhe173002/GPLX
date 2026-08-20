package com.example.gplx.question.dto.response;

public record AnswerResponse(
        Long id,
        String label,
        String content,
        Integer sortOrder
) {
}
