package com.example.gplx.seed.dto.request;

import java.util.List;

public record QuestionImportDto(
        Integer questionNumber,
        String chapterCode,
        String content,
        String imageUrl,
        String questionType,
        Boolean isCritical,
        Boolean hasAnimation,
        List<AnswerImportDto> answers,
        String explanation
) {
}
