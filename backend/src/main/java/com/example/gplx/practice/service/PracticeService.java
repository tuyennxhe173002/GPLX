package com.example.gplx.practice.service;

import com.example.gplx.practice.dto.request.SubmitPracticeAnswerRequest;
import com.example.gplx.practice.dto.response.PracticeAnswerResult;

public interface PracticeService {

    PracticeAnswerResult submitAnswer(SubmitPracticeAnswerRequest request, Long userId);
}
