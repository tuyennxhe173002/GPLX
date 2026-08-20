package com.example.gplx.animation.service;

import com.example.gplx.animation.dto.response.AnimationResponse;

public interface AnimationService {

    AnimationResponse getPracticeAttemptAnimation(Long attemptId);
}
