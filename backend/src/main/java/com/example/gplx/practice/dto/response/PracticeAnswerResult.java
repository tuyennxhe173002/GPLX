package com.example.gplx.practice.dto.response;

import java.util.List;

public record PracticeAnswerResult(
        Long questionId,
        Long selectedAnswerId,
        boolean correct,
        List<Long> correctAnswerIds,
        String explanation,
        PracticeAnswerAnimationResponse animation
) {
}
