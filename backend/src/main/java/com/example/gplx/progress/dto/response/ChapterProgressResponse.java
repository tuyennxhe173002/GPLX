package com.example.gplx.progress.dto.response;

public record ChapterProgressResponse(
        Long chapterId,
        String chapterCode,
        int totalQuestions,
        int attemptedQuestions,
        int correctAttempts,
        int wrongAttempts
) {
}
