package com.example.gplx.question.service;

import com.example.gplx.question.dto.response.PracticeQuestionResponse;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface QuestionService {

    Page<PracticeQuestionResponse> getQuestions(Long chapterId, Pageable pageable);
    PracticeQuestionResponse getQuestion(Long id);
    List<PracticeQuestionResponse> getRandomQuestions(int size);
    List<PracticeQuestionResponse> getCriticalQuestions();
}
