package com.example.gplx.exam.dto.response;

public record ExamProfileResponse(
        Long id,
        String profileCode,
        String displayName,
        Integer questionCount,
        Integer durationMinutes,
        Integer passingScore,
        boolean criticalFailEnabled,
        Integer criticalQuestionCount
) {
}
