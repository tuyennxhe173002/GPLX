package com.example.gplx.animation.service.impl;

import com.example.gplx.animation.dto.response.AnimationResponse;
import com.example.gplx.animation.entity.ExplanationAnimation;
import com.example.gplx.animation.repository.ExplanationAnimationRepository;
import com.example.gplx.animation.service.AnimationService;
import com.example.gplx.common.exception.ApiException;
import com.example.gplx.practice.entity.PracticeAttempt;
import com.example.gplx.practice.repository.PracticeAttemptRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AnimationServiceImpl implements AnimationService {

    private final PracticeAttemptRepository practiceAttemptRepository;
    private final ExplanationAnimationRepository explanationAnimationRepository;

    @Override
    @Transactional(readOnly = true)
    public AnimationResponse getPracticeAttemptAnimation(Long attemptId) {
        PracticeAttempt attempt = practiceAttemptRepository.findById(attemptId)
                .orElseThrow(() -> ApiException.notFound("Practice attempt not found"));

        ExplanationAnimation animation = explanationAnimationRepository.findByQuestion_Id(attempt.getQuestion().getId())
                .orElseThrow(() -> ApiException.notFound("Animation not found"));

        return new AnimationResponse(
                animation.getId(),
                animation.getQuestion().getId(),
                animation.getSceneWidth(),
                animation.getSceneHeight(),
                animation.getBackgroundImageUrl(),
                animation.getDurationMs(),
                animation.getAnimationData()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public AnimationResponse getQuestionAnimation(Long questionId) {
        ExplanationAnimation animation = explanationAnimationRepository.findByQuestion_Id(questionId)
                .orElseThrow(() -> ApiException.notFound("Animation not found for question " + questionId));

        return new AnimationResponse(
                animation.getId(),
                animation.getQuestion().getId(),
                animation.getSceneWidth(),
                animation.getSceneHeight(),
                animation.getBackgroundImageUrl(),
                animation.getDurationMs(),
                animation.getAnimationData()
        );
    }
}
