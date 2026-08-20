package com.example.gplx.seed.dto.request;

import java.time.LocalDate;

public record QuestionBankManifestDto(
        String bankCode,
        String version,
        Integer questionCount,
        Integer criticalQuestionCount,
        String source,
        LocalDate effectiveFrom,
        String chaptersFile,
        String questionsFile,
        String animationsFile
) {
}
