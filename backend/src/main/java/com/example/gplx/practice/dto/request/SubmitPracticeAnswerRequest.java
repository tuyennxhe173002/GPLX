package com.example.gplx.practice.dto.request;

import jakarta.validation.constraints.NotNull;

public record SubmitPracticeAnswerRequest(
        @NotNull Long questionId,
        @NotNull Long answerId
) {
}
