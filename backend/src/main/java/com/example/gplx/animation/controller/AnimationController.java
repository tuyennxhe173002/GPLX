package com.example.gplx.animation.controller;

import com.example.gplx.animation.dto.response.AnimationResponse;
import com.example.gplx.animation.service.AnimationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class AnimationController {

    private final AnimationService animationService;

    @GetMapping("/practice/attempts/{attemptId}/animation")
    public AnimationResponse getPracticeAttemptAnimation(@PathVariable Long attemptId) {
        return animationService.getPracticeAttemptAnimation(attemptId);
    }

    @GetMapping("/animations/questions/{questionId}")
    public AnimationResponse getQuestionAnimation(@PathVariable Long questionId) {
        return animationService.getQuestionAnimation(questionId);
    }
}
