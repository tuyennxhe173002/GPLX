package com.example.gplx.exam.service.impl;

import com.example.gplx.exam.dto.request.CreateExamRequest;
import com.example.gplx.exam.dto.request.SaveExamAnswerRequest;
import com.example.gplx.exam.dto.response.ExamProfileResponse;
import com.example.gplx.exam.dto.response.ExamQuestionResponse;
import com.example.gplx.exam.dto.response.ExamResultQuestionResponse;
import com.example.gplx.exam.dto.response.ExamResultResponse;
import com.example.gplx.exam.dto.response.ExamSessionResponse;
import com.example.gplx.exam.dto.response.SaveExamAnswerResponse;
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
import com.example.gplx.exam.service.ExamService;
import com.example.gplx.common.exception.ApiException;
import com.example.gplx.question.dto.response.AnswerResponse;
import com.example.gplx.question.entity.Answer;
import com.example.gplx.question.entity.Question;
import com.example.gplx.question.mapper.QuestionMapper;
import com.example.gplx.question.repository.AnswerRepository;
import com.example.gplx.question.repository.QuestionRepository;
import com.example.gplx.question.service.QuestionBankVersionService;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ExamServiceImpl implements ExamService {

    private final LicenseExamProfileRepository licenseExamProfileRepository;
    private final ExamSessionRepository examSessionRepository;
    private final ExamSessionQuestionRepository examSessionQuestionRepository;
    private final ExamSessionAnswerRepository examSessionAnswerRepository;
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final QuestionMapper questionMapper;
    private final ExamMapper examMapper;
    private final QuestionBankVersionService questionBankVersionService;

    @Override
    @Transactional(readOnly = true)
    public List<ExamProfileResponse> getActiveProfiles() {
        Long activeQuestionBankVersionId = questionBankVersionService.getActiveQuestionBankVersion().getId();
        return licenseExamProfileRepository.findByQuestionBankVersion_IdAndIsActiveTrueOrderByIdAsc(activeQuestionBankVersionId).stream()
                .map(profile -> new ExamProfileResponse(
                        profile.getId(),
                        profile.getProfileCode(),
                        profile.getDisplayName(),
                        profile.getQuestionCount(),
                        profile.getDurationMinutes(),
                        profile.getPassingScore(),
                        Boolean.TRUE.equals(profile.getCriticalFailEnabled()),
                        profile.getCriticalQuestionCount()
                ))
                .toList();
    }

    @Override
    @Transactional
    public ExamSessionResponse createExam(CreateExamRequest request) {
        Long activeQuestionBankVersionId = questionBankVersionService.getActiveQuestionBankVersion().getId();
        LicenseExamProfile profile = licenseExamProfileRepository
                .findByQuestionBankVersion_IdAndProfileCodeAndIsActiveTrue(activeQuestionBankVersionId, request.profileCode().trim())
                .orElseThrow(() -> ApiException.notFound("Exam profile not found"));

        List<Question> allQuestions = questionRepository.findByQuestionBankVersion_IdOrderByQuestionNumberAsc(profile.getQuestionBankVersion().getId());
        List<Question> criticalQuestions = questionRepository.findByQuestionBankVersion_IdAndIsCriticalTrueOrderByQuestionNumberAsc(profile.getQuestionBankVersion().getId());

        if (allQuestions.size() < profile.getQuestionCount()) {
            throw ApiException.badRequest("Not enough questions for exam profile");
        }
        if (criticalQuestions.size() < profile.getCriticalQuestionCount()) {
            throw ApiException.badRequest("Not enough critical questions for exam profile");
        }

        List<Question> selectedQuestions = buildExamQuestionSet(profile, allQuestions, criticalQuestions);

        ExamSession session = new ExamSession();
        session.setLicenseExamProfile(profile);
        session.setLicenseType(profile.getProfileCode());
        session.setTotalQuestions(profile.getQuestionCount());
        session.setState(ExamSessionState.IN_PROGRESS);
        session.setStartedAt(Instant.now());
        session.setExpiresAt(session.getStartedAt().plusSeconds(profile.getDurationMinutes() * 60L));
        session = examSessionRepository.save(session);

        for (int index = 0; index < selectedQuestions.size(); index++) {
            ExamSessionQuestion sessionQuestion = new ExamSessionQuestion();
            sessionQuestion.setExamSession(session);
            sessionQuestion.setQuestion(selectedQuestions.get(index));
            sessionQuestion.setSortOrder(index + 1);
            examSessionQuestionRepository.save(sessionQuestion);
        }

        return toExamSessionResponse(session, selectedQuestions);
    }

    @Override
    @Transactional(readOnly = true)
    public ExamSessionResponse getExam(Long examId) {
        ExamSession session = findSession(examId);
        List<Question> questions = examSessionQuestionRepository.findByExamSession_IdOrderBySortOrderAsc(examId).stream()
                .map(ExamSessionQuestion::getQuestion)
                .toList();
        return toExamSessionResponse(session, questions);
    }

    @Override
    @Transactional
    public SaveExamAnswerResponse saveAnswer(Long examId, Long questionId, SaveExamAnswerRequest request) {
        ExamSession session = findSession(examId);
        if (isExpired(session)) {
            gradeExam(session, true);
            throw ApiException.badRequest("Exam session has expired");
        }
        if (session.getState() != ExamSessionState.IN_PROGRESS) {
            throw ApiException.badRequest("Exam session is not editable");
        }

        boolean questionBelongsToSession = examSessionQuestionRepository.findByExamSession_IdOrderBySortOrderAsc(examId).stream()
                .anyMatch(item -> item.getQuestion().getId().equals(questionId));
        if (!questionBelongsToSession) {
            throw ApiException.badRequest("Question does not belong to exam session");
        }

        Answer selectedAnswer = answerRepository.findById(request.answerId())
                .orElseThrow(() -> ApiException.notFound("Answer not found"));
        if (!selectedAnswer.getQuestion().getId().equals(questionId)) {
            throw ApiException.badRequest("Answer does not belong to question");
        }

        ExamSessionAnswer sessionAnswer = examSessionAnswerRepository.findByExamSession_IdAndQuestion_Id(examId, questionId)
                .orElseGet(ExamSessionAnswer::new);
        sessionAnswer.setExamSession(session);
        sessionAnswer.setQuestion(selectedAnswer.getQuestion());
        sessionAnswer.setSelectedAnswer(selectedAnswer);
        sessionAnswer.setAnsweredAt(Instant.now());
        sessionAnswer.setUpdatedAt(Instant.now());
        examSessionAnswerRepository.save(sessionAnswer);
        return new SaveExamAnswerResponse(true);
    }

    @Override
    @Transactional
    public ExamResultResponse submitExam(Long examId) {
        ExamSession session = findSession(examId);
        return gradeExam(session, isExpired(session));
    }

    @Override
    @Transactional(readOnly = true)
    public ExamResultResponse getExamResult(Long examId) {
        ExamSession session = findSession(examId);
        if (session.getState() != ExamSessionState.SUBMITTED && session.getState() != ExamSessionState.EXPIRED) {
            throw ApiException.badRequest("Exam result is not available yet");
        }
        return buildExamResult(session);
    }

    private List<Question> buildExamQuestionSet(LicenseExamProfile profile, List<Question> allQuestions, List<Question> criticalQuestions) {
        List<Question> criticalPool = new ArrayList<>(criticalQuestions);
        Collections.shuffle(criticalPool);

        List<Question> nonCriticalPool = allQuestions.stream()
                .filter(question -> !Boolean.TRUE.equals(question.getIsCritical()))
                .collect(Collectors.toCollection(ArrayList::new));
        Collections.shuffle(nonCriticalPool);

        List<Question> selected = new ArrayList<>(criticalPool.subList(0, profile.getCriticalQuestionCount()));
        int remainingSlots = profile.getQuestionCount() - selected.size();
        if (nonCriticalPool.size() < remainingSlots) {
            throw ApiException.badRequest("Not enough non-critical questions for exam profile");
        }
        selected.addAll(nonCriticalPool.subList(0, remainingSlots));
        Collections.shuffle(selected);
        return selected;
    }

    private ExamSessionResponse toExamSessionResponse(ExamSession session, List<Question> questions) {
        Map<Long, List<AnswerResponse>> answersByQuestionId = getAnswersByQuestionId(questions);
        Map<Long, ExamSessionAnswer> selectedAnswersByQuestionId = examSessionAnswerRepository.findByExamSession_Id(session.getId()).stream()
                .collect(Collectors.toMap(answer -> answer.getQuestion().getId(), Function.identity()));
        List<ExamQuestionResponse> examQuestions = questions.stream()
                .map(question -> examMapper.toExamQuestionResponse(
                        question,
                        selectedAnswersByQuestionId.get(question.getId()) == null || selectedAnswersByQuestionId.get(question.getId()).getSelectedAnswer() == null
                                ? null
                                : selectedAnswersByQuestionId.get(question.getId()).getSelectedAnswer().getId(),
                        answersByQuestionId.getOrDefault(question.getId(), List.of())
                ))
                .toList();
        return new ExamSessionResponse(
                session.getId(),
                session.getLicenseExamProfile().getProfileCode(),
                session.getLicenseExamProfile().getDisplayName(),
                session.getState(),
                session.getStartedAt(),
                session.getExpiresAt(),
                examQuestions
        );
    }

    private ExamResultResponse gradeExam(ExamSession session, boolean expired) {
        if (session.getState() == ExamSessionState.SUBMITTED || session.getState() == ExamSessionState.EXPIRED) {
            return buildExamResult(session);
        }

        List<ExamSessionQuestion> sessionQuestions = examSessionQuestionRepository.findByExamSession_IdOrderBySortOrderAsc(session.getId());
        Map<Long, ExamSessionAnswer> answersByQuestionId = examSessionAnswerRepository.findByExamSession_Id(session.getId()).stream()
                .collect(Collectors.toMap(answer -> answer.getQuestion().getId(), Function.identity()));

        int correctCount = 0;
        int wrongCount = 0;
        int criticalWrongCount = 0;
        for (ExamSessionQuestion sessionQuestion : sessionQuestions) {
            ExamSessionAnswer sessionAnswer = answersByQuestionId.get(sessionQuestion.getQuestion().getId());
            boolean correct = sessionAnswer != null
                    && sessionAnswer.getSelectedAnswer() != null
                    && Boolean.TRUE.equals(sessionAnswer.getSelectedAnswer().getIsCorrect());
            if (sessionAnswer != null) {
                sessionAnswer.setCorrect(correct);
                sessionAnswer.setUpdatedAt(Instant.now());
                examSessionAnswerRepository.save(sessionAnswer);
            }
            if (correct) {
                correctCount++;
            } else {
                wrongCount++;
                if (Boolean.TRUE.equals(sessionQuestion.getQuestion().getIsCritical())) {
                    criticalWrongCount++;
                }
            }
        }

        session.setCorrectCount(correctCount);
        session.setWrongCount(wrongCount);
        session.setCriticalWrongCount(criticalWrongCount);
        boolean passed = correctCount >= session.getLicenseExamProfile().getPassingScore()
                && (!Boolean.TRUE.equals(session.getLicenseExamProfile().getCriticalFailEnabled()) || criticalWrongCount == 0);
        session.setPassed(passed);
        session.setState(expired ? ExamSessionState.EXPIRED : ExamSessionState.SUBMITTED);
        session.setFinishedAt(Instant.now());
        session.setUpdatedAt(Instant.now());
        examSessionRepository.save(session);
        return buildExamResult(session);
    }

    private ExamResultResponse buildExamResult(ExamSession session) {
        List<ExamSessionQuestion> sessionQuestions = examSessionQuestionRepository.findByExamSession_IdOrderBySortOrderAsc(session.getId());
        Map<Long, ExamSessionAnswer> answersByQuestionId = examSessionAnswerRepository.findByExamSession_Id(session.getId()).stream()
                .collect(Collectors.toMap(answer -> answer.getQuestion().getId(), Function.identity()));

        List<ExamResultQuestionResponse> questionResults = sessionQuestions.stream()
                .map(sessionQuestion -> {
                    Question question = sessionQuestion.getQuestion();
                    ExamSessionAnswer sessionAnswer = answersByQuestionId.get(question.getId());
                    List<Long> correctAnswerIds = answerRepository.findByQuestion_IdAndIsCorrectTrueOrderBySortOrderAsc(question.getId()).stream()
                            .map(Answer::getId)
                            .toList();
                    return new ExamResultQuestionResponse(
                            question.getId(),
                            question.getQuestionNumber(),
                            sessionAnswer == null || sessionAnswer.getSelectedAnswer() == null ? null : sessionAnswer.getSelectedAnswer().getId(),
                            correctAnswerIds,
                            sessionAnswer != null && Boolean.TRUE.equals(sessionAnswer.getCorrect()),
                            question.getExplanation()
                    );
                })
                .toList();

        return new ExamResultResponse(
                session.getId(),
                session.getLicenseExamProfile().getProfileCode(),
                session.getState(),
                session.getCorrectCount(),
                Boolean.TRUE.equals(session.getPassed()),
                session.getCriticalWrongCount(),
                questionResults
        );
    }

    private Map<Long, List<AnswerResponse>> getAnswersByQuestionId(List<Question> questions) {
        List<Long> questionIds = questions.stream().map(Question::getId).toList();
        if (questionIds.isEmpty()) {
            return Collections.emptyMap();
        }
        return answerRepository.findByQuestionIds(questionIds).stream()
                .collect(Collectors.groupingBy(
                        answer -> answer.getQuestion().getId(),
                        Collectors.mapping(questionMapper::toResponse, Collectors.toList())
                ));
    }

    private boolean isExpired(ExamSession session) {
        return session.getExpiresAt() != null && Instant.now().isAfter(session.getExpiresAt());
    }

    private ExamSession findSession(Long examId) {
        return examSessionRepository.findById(examId)
                .orElseThrow(() -> ApiException.notFound("Exam session not found"));
    }
}
