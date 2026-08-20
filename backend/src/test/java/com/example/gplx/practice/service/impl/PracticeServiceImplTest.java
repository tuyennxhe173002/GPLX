package com.example.gplx.practice.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.example.gplx.animation.entity.ExplanationAnimation;
import com.example.gplx.animation.repository.ExplanationAnimationRepository;
import com.example.gplx.chapter.entity.Chapter;
import com.example.gplx.common.exception.ApiException;
import com.example.gplx.practice.dto.request.SubmitPracticeAnswerRequest;
import com.example.gplx.practice.dto.response.PracticeAnswerResult;
import com.example.gplx.practice.entity.PracticeAttempt;
import com.example.gplx.practice.repository.PracticeAttemptRepository;
import com.example.gplx.progress.service.ProgressService;
import com.example.gplx.question.entity.Answer;
import com.example.gplx.question.entity.Question;
import com.example.gplx.question.entity.QuestionBankVersion;
import com.example.gplx.question.entity.QuestionType;
import com.example.gplx.question.repository.AnswerRepository;
import com.example.gplx.question.repository.QuestionRepository;
import com.example.gplx.question.service.QuestionBankVersionService;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class PracticeServiceImplTest {

    @Mock
    private QuestionRepository questionRepository;

    @Mock
    private AnswerRepository answerRepository;

    @Mock
    private PracticeAttemptRepository practiceAttemptRepository;

    @Mock
    private ExplanationAnimationRepository explanationAnimationRepository;

    @Mock
    private ProgressService progressService;

    @Mock
    private QuestionBankVersionService questionBankVersionService;

    @InjectMocks
    private PracticeServiceImpl practiceService;

    @Test
    void submitAnswerShouldReturnResultAndRecordProgress() {
        QuestionBankVersion bankVersion = new QuestionBankVersion();
        bankVersion.setId(1L);
        Chapter chapter = new Chapter();
        chapter.setId(7L);
        Question question = new Question();
        question.setId(101L);
        question.setQuestionBankVersion(bankVersion);
        question.setChapter(chapter);
        question.setQuestionNumber(5);
        question.setQuestionType(QuestionType.TEXT);
        question.setExplanation("Correct explanation");

        Answer answer = new Answer();
        answer.setId(201L);
        answer.setQuestion(question);
        answer.setIsCorrect(true);

        PracticeAttempt savedAttempt = new PracticeAttempt();
        savedAttempt.setId(301L);
        savedAttempt.setCorrect(true);

        ExplanationAnimation animation = new ExplanationAnimation();
        animation.setId(401L);

        when(questionBankVersionService.getActiveQuestionBankVersion()).thenReturn(bankVersion);
        when(questionRepository.findByIdAndQuestionBankVersion_Id(101L, 1L)).thenReturn(Optional.of(question));
        when(answerRepository.findById(201L)).thenReturn(Optional.of(answer));
        when(practiceAttemptRepository.save(any(PracticeAttempt.class))).thenReturn(savedAttempt);
        when(answerRepository.findByQuestion_IdAndIsCorrectTrueOrderBySortOrderAsc(101L)).thenReturn(List.of(answer));
        when(explanationAnimationRepository.findByQuestion_Id(101L)).thenReturn(Optional.of(animation));

        PracticeAnswerResult result = practiceService.submitAnswer(new SubmitPracticeAnswerRequest(101L, 201L), 99L);

        assertThat(result.correct()).isTrue();
        assertThat(result.correctAnswerIds()).containsExactly(201L);
        assertThat(result.animation().available()).isTrue();
        verify(progressService).recordPracticeAttempt(99L, question, answer, true);
    }

    @Test
    void submitAnswerShouldRejectAnswerFromDifferentQuestion() {
        QuestionBankVersion bankVersion = new QuestionBankVersion();
        bankVersion.setId(1L);
        Question question = new Question();
        question.setId(101L);
        question.setQuestionBankVersion(bankVersion);

        Question anotherQuestion = new Question();
        anotherQuestion.setId(102L);
        Answer answer = new Answer();
        answer.setId(202L);
        answer.setQuestion(anotherQuestion);

        when(questionBankVersionService.getActiveQuestionBankVersion()).thenReturn(bankVersion);
        when(questionRepository.findByIdAndQuestionBankVersion_Id(101L, 1L)).thenReturn(Optional.of(question));
        when(answerRepository.findById(202L)).thenReturn(Optional.of(answer));

        assertThrows(ApiException.class, () -> practiceService.submitAnswer(new SubmitPracticeAnswerRequest(101L, 202L), null));
        verify(progressService, never()).recordPracticeAttempt(any(), any(), any(), anyBoolean());
    }
}
