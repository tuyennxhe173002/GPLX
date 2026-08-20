package com.example.gplx.practice.service.impl;

import com.example.gplx.animation.entity.ExplanationAnimation;
import com.example.gplx.animation.repository.ExplanationAnimationRepository;
import com.example.gplx.practice.dto.request.SubmitPracticeAnswerRequest;
import com.example.gplx.practice.dto.response.PracticeAnswerAnimationResponse;
import com.example.gplx.practice.dto.response.PracticeAnswerResult;
import com.example.gplx.practice.entity.PracticeAttempt;
import com.example.gplx.practice.repository.PracticeAttemptRepository;
import com.example.gplx.practice.service.PracticeService;
import com.example.gplx.progress.service.ProgressService;
import com.example.gplx.common.exception.ApiException;
import com.example.gplx.question.entity.Answer;
import com.example.gplx.question.entity.Question;
import com.example.gplx.question.repository.AnswerRepository;
import com.example.gplx.question.repository.QuestionRepository;
import com.example.gplx.question.service.QuestionBankVersionService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PracticeServiceImpl implements PracticeService {

    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final PracticeAttemptRepository practiceAttemptRepository;
    private final ExplanationAnimationRepository explanationAnimationRepository;
    private final ProgressService progressService;
    private final QuestionBankVersionService questionBankVersionService;

    @Override
    @Transactional
    public PracticeAnswerResult submitAnswer(SubmitPracticeAnswerRequest request, Long userId) {
        Long activeQuestionBankVersionId = questionBankVersionService.getActiveQuestionBankVersion().getId();
        Question question = questionRepository.findByIdAndQuestionBankVersion_Id(request.questionId(), activeQuestionBankVersionId)
                .orElseThrow(() -> ApiException.notFound("Question not found"));
        Answer selectedAnswer = answerRepository.findById(request.answerId())
                .orElseThrow(() -> ApiException.notFound("Answer not found"));

        if (!selectedAnswer.getQuestion().getId().equals(question.getId())) {
            throw ApiException.badRequest("Answer does not belong to question");
        }

        PracticeAttempt attempt = new PracticeAttempt();
        attempt.setUserId(userId);
        attempt.setQuestion(question);
        attempt.setSelectedAnswer(selectedAnswer);
        attempt.setCorrect(Boolean.TRUE.equals(selectedAnswer.getIsCorrect()));
        attempt.setUpdatedAt(java.time.Instant.now());
        PracticeAttempt savedAttempt = practiceAttemptRepository.save(attempt);

        if (userId != null) {
            progressService.recordPracticeAttempt(userId, question, selectedAnswer, savedAttempt.isCorrect());
        }

        List<Long> correctAnswerIds = answerRepository.findByQuestion_IdAndIsCorrectTrueOrderBySortOrderAsc(question.getId()).stream()
                .map(Answer::getId)
                .toList();

        ExplanationAnimation animation = explanationAnimationRepository.findByQuestion_Id(question.getId()).orElse(null);

        return new PracticeAnswerResult(
                question.getId(),
                selectedAnswer.getId(),
                savedAttempt.isCorrect(),
                correctAnswerIds,
                question.getExplanation(),
                new PracticeAnswerAnimationResponse(animation != null, savedAttempt.getId(), animation == null ? null : animation.getId())
        );
    }
}
