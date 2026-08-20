package com.example.gplx.exam.dto.response;

import java.util.List;

public record ExamResultQuestionResponse(
        Long questionId,
        Integer questionNumber,
        Long selectedAnswerId,
        List<Long> correctAnswerIds,
        boolean correct,
        String explanation
) {
}
