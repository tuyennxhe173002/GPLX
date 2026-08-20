package com.example.gplx.practice.controller;

import com.example.gplx.auth.service.CurrentUserService;
import com.example.gplx.practice.dto.request.SubmitPracticeAnswerRequest;
import com.example.gplx.practice.dto.response.PracticeAnswerResult;
import com.example.gplx.practice.service.PracticeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/practice")
@RequiredArgsConstructor
public class PracticeController {

    private final PracticeService practiceService;
    private final CurrentUserService currentUserService;

    @PostMapping("/answers")
    public PracticeAnswerResult submitAnswer(@Valid @RequestBody SubmitPracticeAnswerRequest request) {
        return practiceService.submitAnswer(request, currentUserService.getCurrentUserIdOrNull());
    }
}
