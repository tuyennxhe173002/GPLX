package com.example.gplx.question.dto.response;

import com.example.gplx.question.entity.QuestionType;
import java.util.List;

public record PracticeQuestionResponse(
        Long id,
        Integer questionNumber,
        Long chapterId,
        String chapterCode,
        String content,
        String imageUrl,
        QuestionType questionType,
        Boolean isCritical,
        List<AnswerResponse> answers
) {
}
