package com.example.gplx.exam.dto.response;

import com.example.gplx.exam.entity.ExamSessionState;
import java.util.List;

public record ExamResultResponse(
        Long examId,
        String profileCode,
        ExamSessionState state,
        Integer score,
        boolean passed,
        Integer criticalWrongCount,
        List<ExamResultQuestionResponse> questions
) {
}
