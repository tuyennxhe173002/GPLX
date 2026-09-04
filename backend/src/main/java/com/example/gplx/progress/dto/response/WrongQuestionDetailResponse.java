package com.example.gplx.progress.dto.response;

import com.example.gplx.question.dto.response.AnswerResponse;
import com.example.gplx.question.entity.QuestionType;
import java.time.Instant;
import java.util.List;

public record WrongQuestionDetailResponse(
        Long questionId,
        Integer questionNumber,
        String content,
        String imageUrl,
        QuestionType questionType,
        Boolean isCritical,
        Boolean hasAnimation,
        Long chapterId,
        String chapterCode,
        Integer wrongCount,
        Integer correctCount,
        Integer totalAttempts,
        Boolean lastCorrect,
        Instant lastAnsweredAt,
        List<AnswerResponse> answers
) {
}
