package com.example.gplx.exam.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import com.example.gplx.chapter.entity.Chapter;
import com.example.gplx.common.exception.ApiException;
import com.example.gplx.exam.dto.response.ExamResultResponse;
import com.example.gplx.exam.entity.ExamSession;
import com.example.gplx.exam.entity.ExamSessionAnswer;
import com.example.gplx.exam.entity.ExamSessionQuestion;
import com.example.gplx.exam.entity.ExamSessionState;
import com.example.gplx.exam.entity.LicenseExamProfile;
import com.example.gplx.exam.mapper.ExamMapper;
import com.example.gplx.exam.repository.ExamSessionAnswerRepository;
import com.example.gplx.exam.repository.ExamSessionQuestionRepository;
import com.example.gplx.exam.repository.ExamSessionRepository;
import com.example.gplx.exam.repository.LicenseExamProfileRepository;
import com.example.gplx.question.entity.Answer;
import com.example.gplx.question.entity.Question;
import com.example.gplx.question.entity.QuestionBankVersion;
import com.example.gplx.question.mapper.QuestionMapper;
import com.example.gplx.question.repository.AnswerRepository;
import com.example.gplx.question.repository.QuestionRepository;
import com.example.gplx.question.service.QuestionBankVersionService;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ExamServiceImplTest {

    @Mock
    private LicenseExamProfileRepository licenseExamProfileRepository;

    @Mock
    private ExamSessionRepository examSessionRepository;

    @Mock
    private ExamSessionQuestionRepository examSessionQuestionRepository;

    @Mock
    private ExamSessionAnswerRepository examSessionAnswerRepository;

    @Mock
    private QuestionRepository questionRepository;

    @Mock
    private AnswerRepository answerRepository;

    @Mock
    private QuestionMapper questionMapper;

    @Mock
    private ExamMapper examMapper;

    @Mock
    private QuestionBankVersionService questionBankVersionService;

    @InjectMocks
    private ExamServiceImpl examService;

    @Test
    void submitExamShouldFailWhenCriticalQuestionAnsweredWrong() {
        QuestionBankVersion bankVersion = new QuestionBankVersion();
        bankVersion.setId(1L);
        LicenseExamProfile profile = new LicenseExamProfile();
        profile.setId(1L);
        profile.setProfileCode("B");
        profile.setDisplayName("GPLX B");
        profile.setPassingScore(1);
        profile.setCriticalFailEnabled(true);
        profile.setCriticalQuestionCount(1);

        ExamSession session = new ExamSession();
        session.setId(100L);
        session.setLicenseExamProfile(profile);
        session.setState(ExamSessionState.IN_PROGRESS);
        session.setStartedAt(Instant.now());
        session.setExpiresAt(Instant.now().plusSeconds(600));

        Chapter chapter = new Chapter();
        chapter.setId(1L);
        Question question = new Question();
        question.setId(10L);
        question.setQuestionNumber(1);
        question.setChapter(chapter);
        question.setIsCritical(true);
        question.setExplanation("Explain");

        ExamSessionQuestion sessionQuestion = new ExamSessionQuestion();
        sessionQuestion.setExamSession(session);
        sessionQuestion.setQuestion(question);
        sessionQuestion.setSortOrder(1);

        Answer wrongAnswer = new Answer();
        wrongAnswer.setId(20L);
        wrongAnswer.setQuestion(question);
        wrongAnswer.setIsCorrect(false);

        ExamSessionAnswer examSessionAnswer = new ExamSessionAnswer();
        examSessionAnswer.setExamSession(session);
        examSessionAnswer.setQuestion(question);
        examSessionAnswer.setSelectedAnswer(wrongAnswer);

        when(examSessionRepository.findById(100L)).thenReturn(Optional.of(session));
        when(examSessionQuestionRepository.findByExamSession_IdOrderBySortOrderAsc(100L)).thenReturn(List.of(sessionQuestion));
        when(examSessionAnswerRepository.findByExamSession_Id(100L)).thenReturn(List.of(examSessionAnswer));
        when(answerRepository.findByQuestion_IdAndIsCorrectTrueOrderBySortOrderAsc(10L)).thenReturn(List.of());
        when(examSessionRepository.save(any(ExamSession.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(examSessionAnswerRepository.save(any(ExamSessionAnswer.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ExamResultResponse result = examService.submitExam(100L);

        assertThat(result.passed()).isFalse();
        assertThat(result.criticalWrongCount()).isEqualTo(1);
        assertThat(result.state()).isEqualTo(ExamSessionState.SUBMITTED);
    }

    @Test
    void getExamResultShouldRejectWhenExamNotFinished() {
        LicenseExamProfile profile = new LicenseExamProfile();
        profile.setProfileCode("B");
        ExamSession session = new ExamSession();
        session.setId(100L);
        session.setLicenseExamProfile(profile);
        session.setState(ExamSessionState.IN_PROGRESS);

        when(examSessionRepository.findById(100L)).thenReturn(Optional.of(session));

        assertThrows(ApiException.class, () -> examService.getExamResult(100L));
    }
}
