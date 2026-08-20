package com.example.gplx.exam.dto.request;

import jakarta.validation.constraints.NotNull;

public record SaveExamAnswerRequest(
        @NotNull Long answerId
) {
}
