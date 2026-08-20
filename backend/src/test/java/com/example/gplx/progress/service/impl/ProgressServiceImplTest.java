package com.example.gplx.progress.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import com.example.gplx.chapter.entity.Chapter;
import com.example.gplx.progress.dto.response.ProgressSummaryResponse;
import com.example.gplx.progress.entity.UserQuestionProgress;
import com.example.gplx.progress.repository.UserQuestionProgressRepository;
import com.example.gplx.question.entity.Question;
import com.example.gplx.question.entity.QuestionBankVersion;
import com.example.gplx.question.mapper.QuestionMapper;
import com.example.gplx.question.repository.AnswerRepository;
import com.example.gplx.question.repository.QuestionRepository;
import com.example.gplx.question.service.QuestionBankVersionService;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ProgressServiceImplTest {

    @Mock
    private UserQuestionProgressRepository userQuestionProgressRepository;

    @Mock
    private QuestionRepository questionRepository;

    @Mock
    private AnswerRepository answerRepository;

    @Mock
    private QuestionMapper questionMapper;

    @Mock
    private QuestionBankVersionService questionBankVersionService;

    @InjectMocks
    private ProgressServiceImpl progressService;

    @Test
    void getProgressSummaryShouldAggregateAttemptsForActiveBankVersion() {
        QuestionBankVersion activeVersion = new QuestionBankVersion();
        activeVersion.setId(1L);
        Chapter chapter = new Chapter();
        chapter.setId(1L);

        Question question = new Question();
        question.setId(10L);
        question.setQuestionBankVersion(activeVersion);
        question.setChapter(chapter);

        UserQuestionProgress progress = new UserQuestionProgress();
        progress.setQuestion(question);
        progress.setCorrectAttempts(3);
        progress.setWrongAttempts(1);

        when(questionBankVersionService.getActiveQuestionBankVersion()).thenReturn(activeVersion);
        when(userQuestionProgressRepository.findByUserId(99L)).thenReturn(List.of(progress));
        when(questionRepository.countByQuestionBankVersion_Id(1L)).thenReturn(100L);

        ProgressSummaryResponse summary = progressService.getProgressSummary(99L);

        assertThat(summary.totalQuestions()).isEqualTo(100);
        assertThat(summary.attemptedQuestions()).isEqualTo(1);
        assertThat(summary.correctAttempts()).isEqualTo(3);
        assertThat(summary.wrongAttempts()).isEqualTo(1);
        assertThat(summary.masteryScore()).isEqualTo(0.75d);
    }
}
