package com.example.gplx.question.mapper;

import com.example.gplx.question.dto.response.AnswerResponse;
import com.example.gplx.question.dto.response.PracticeQuestionResponse;
import com.example.gplx.question.dto.response.QuestionSummaryResponse;
import com.example.gplx.question.entity.Answer;
import com.example.gplx.question.entity.Question;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class QuestionMapper {

    public PracticeQuestionResponse toPracticeQuestionResponse(Question question, List<AnswerResponse> answers) {
        return new PracticeQuestionResponse(
                question.getId(),
                question.getQuestionNumber(),
                question.getChapter().getId(),
                question.getChapter().getCode(),
                question.getContent(),
                question.getImageUrl(),
                question.getQuestionType(),
                question.getIsCritical(),
                answers
        );
    }

    public QuestionSummaryResponse toQuestionSummaryResponse(Question question) {
        return new QuestionSummaryResponse(
                question.getId(),
                question.getQuestionNumber(),
                question.getChapter().getId(),
                question.getChapter().getCode(),
                question.getContent(),
                question.getImageUrl(),
                question.getQuestionType(),
                question.getIsCritical()
        );
    }

    public AnswerResponse toResponse(Answer answer) {
        return new AnswerResponse(
                answer.getId(),
                answer.getLabel(),
                answer.getContent(),
                answer.getSortOrder()
        );
    }
}
