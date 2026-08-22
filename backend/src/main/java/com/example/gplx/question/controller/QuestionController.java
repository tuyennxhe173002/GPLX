package com.example.gplx.question.controller;

import com.example.gplx.question.dto.response.PracticeQuestionResponse;
import com.example.gplx.question.service.QuestionService;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/api/v1/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @GetMapping
    public Page<PracticeQuestionResponse> getQuestions(
            @RequestParam(required = false) Long chapterId,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "20") @Min(1) @Max(600) int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("questionNumber").ascending());
        return questionService.getQuestions(chapterId, pageable);
    }

    @GetMapping("/{id}")
    public PracticeQuestionResponse getQuestion(@PathVariable Long id) {
        return questionService.getQuestion(id);
    }

    @GetMapping("/number/{questionNumber}")
    public PracticeQuestionResponse getQuestionByNumber(@PathVariable Integer questionNumber) {
        return questionService.getQuestionByNumber(questionNumber);
    }

    @GetMapping("/random")
    public List<PracticeQuestionResponse> getRandomQuestions(
            @RequestParam(defaultValue = "20") @Min(1) @Max(100) int size
    ) {
        return questionService.getRandomQuestions(size);
    }

    @GetMapping("/critical")
    public List<PracticeQuestionResponse> getCriticalQuestions() {
        return questionService.getCriticalQuestions();
    }
}
