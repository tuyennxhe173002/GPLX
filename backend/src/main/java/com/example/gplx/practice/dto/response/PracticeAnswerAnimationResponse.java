package com.example.gplx.practice.dto.response;

public record PracticeAnswerAnimationResponse(
        boolean available,
        Long attemptId,
        Long animationId
) {
}
