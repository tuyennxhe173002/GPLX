package com.example.gplx.exam.dto.response;

import com.example.gplx.exam.entity.ExamSessionState;
import java.time.Instant;
import java.util.List;

public record ExamSessionResponse(
        Long id,
        String profileCode,
        String profileName,
        ExamSessionState state,
        Instant startedAt,
        Instant expiresAt,
        List<ExamQuestionResponse> questions
) {
}
