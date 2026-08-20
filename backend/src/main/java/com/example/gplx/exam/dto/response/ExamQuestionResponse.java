package com.example.gplx.exam.dto.response;

import com.example.gplx.question.dto.response.AnswerResponse;
import com.example.gplx.question.entity.QuestionType;
import java.util.List;

public record ExamQuestionResponse(
        Long id,
        Integer questionNumber,
        String content,
        String imageUrl,
        QuestionType questionType,
        Boolean isCritical,
        Long selectedAnswerId,
        List<AnswerResponse> answers
) {
}
