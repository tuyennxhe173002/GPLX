package com.example.gplx.exam.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CreateExamRequest(
        @NotBlank String profileCode
) {
}
