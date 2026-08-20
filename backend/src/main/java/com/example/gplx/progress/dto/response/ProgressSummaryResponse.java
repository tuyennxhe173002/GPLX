package com.example.gplx.progress.dto.response;

public record ProgressSummaryResponse(
        int totalQuestions,
        int attemptedQuestions,
        int correctAttempts,
        int wrongAttempts,
        double masteryScore
) {
}
