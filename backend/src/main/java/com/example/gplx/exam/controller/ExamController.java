package com.example.gplx.exam.controller;

import com.example.gplx.exam.dto.request.CreateExamRequest;
import com.example.gplx.exam.dto.request.SaveExamAnswerRequest;
import com.example.gplx.exam.dto.response.ExamResultResponse;
import com.example.gplx.exam.dto.response.ExamSessionResponse;
import com.example.gplx.exam.dto.response.SaveExamAnswerResponse;
import com.example.gplx.exam.service.ExamService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/exams")
@RequiredArgsConstructor
public class ExamController {

    private final ExamService examService;

    @PostMapping
    public ExamSessionResponse createExam(@Valid @RequestBody CreateExamRequest request) {
        return examService.createExam(request);
    }

    @GetMapping("/{examId}")
    public ExamSessionResponse getExam(@PathVariable Long examId) {
        return examService.getExam(examId);
    }

    @PutMapping("/{examId}/answers/{questionId}")
    public SaveExamAnswerResponse saveAnswer(
            @PathVariable Long examId,
            @PathVariable Long questionId,
            @Valid @RequestBody SaveExamAnswerRequest request
    ) {
        return examService.saveAnswer(examId, questionId, request);
    }

    @PostMapping("/{examId}/submit")
    public ExamResultResponse submitExam(@PathVariable Long examId) {
        return examService.submitExam(examId);
    }

    @GetMapping("/{examId}/result")
    public ExamResultResponse getExamResult(@PathVariable Long examId) {
        return examService.getExamResult(examId);
    }
}
