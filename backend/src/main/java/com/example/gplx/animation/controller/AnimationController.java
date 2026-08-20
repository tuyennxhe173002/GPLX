package com.example.gplx.animation.controller;

import com.example.gplx.animation.dto.response.AnimationResponse;
import com.example.gplx.animation.service.AnimationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/practice/attempts")
@RequiredArgsConstructor
public class AnimationController {

    private final AnimationService animationService;

    @GetMapping("/{attemptId}/animation")
    public AnimationResponse getPracticeAttemptAnimation(@PathVariable Long attemptId) {
        return animationService.getPracticeAttemptAnimation(attemptId);
    }
}
