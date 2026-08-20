package com.example.gplx.exam.mapper;

import com.example.gplx.exam.dto.response.ExamQuestionResponse;
import com.example.gplx.question.dto.response.AnswerResponse;
import com.example.gplx.question.entity.Question;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class ExamMapper {

    public ExamQuestionResponse toExamQuestionResponse(Question question, Long selectedAnswerId, List<AnswerResponse> answers) {
        return new ExamQuestionResponse(
                question.getId(),
                question.getQuestionNumber(),
                question.getContent(),
                question.getImageUrl(),
                question.getQuestionType(),
                question.getIsCritical(),
                selectedAnswerId,
                answers
        );
    }
}
