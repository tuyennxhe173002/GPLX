package com.example.gplx.progress.dto.response;

import java.time.Instant;
import java.util.List;

public record UserHistoryResponse(
        List<PracticeHistoryItem> recentPracticeAttempts,
        List<ExamHistoryItem> recentExamSessions
) {

    public record PracticeHistoryItem(
            Long id,
            Long questionId,
            Integer questionNumber,
            String questionContent,
            Long selectedAnswerId,
            String selectedAnswerContent,
            Boolean isCorrect,
            Instant createdAt
    ) {}

    public record ExamHistoryItem(
            Long sessionId,
            String licenseType,
            Integer totalQuestions,
            Integer correctCount,
            Integer wrongCount,
            Integer criticalWrongCount,
            Boolean passed,
            String state,
            Instant startedAt,
            Instant finishedAt
    ) {}
}
