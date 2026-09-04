package com.example.gplx.progress.service.impl;

import com.example.gplx.exam.entity.ExamSession;
import com.example.gplx.exam.repository.ExamSessionRepository;
import com.example.gplx.practice.entity.PracticeAttempt;
import com.example.gplx.practice.repository.PracticeAttemptRepository;
import com.example.gplx.progress.dto.response.ChapterProgressResponse;
import com.example.gplx.progress.dto.response.ProgressSummaryResponse;
import com.example.gplx.progress.dto.response.UserHistoryResponse;
import com.example.gplx.progress.dto.response.WrongQuestionDetailResponse;
import com.example.gplx.progress.entity.UserQuestionProgress;
import com.example.gplx.progress.repository.UserQuestionProgressRepository;
import com.example.gplx.progress.service.ProgressService;
import com.example.gplx.question.dto.response.AnswerResponse;
import com.example.gplx.question.entity.Answer;
import com.example.gplx.question.entity.Question;
import com.example.gplx.question.mapper.QuestionMapper;
import com.example.gplx.question.repository.AnswerRepository;
import com.example.gplx.question.repository.QuestionRepository;
import com.example.gplx.question.service.QuestionBankVersionService;
import java.time.Instant;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProgressServiceImpl implements ProgressService {

    private final UserQuestionProgressRepository userQuestionProgressRepository;
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final QuestionMapper questionMapper;
    private final QuestionBankVersionService questionBankVersionService;
    private final PracticeAttemptRepository practiceAttemptRepository;
    private final ExamSessionRepository examSessionRepository;

    @Override
    @Transactional
    public void recordPracticeAttempt(Long userId, Question question, Answer selectedAnswer, boolean correct) {
        UserQuestionProgress progress = userQuestionProgressRepository.findByUserIdAndQuestion_Id(userId, question.getId())
                .orElseGet(UserQuestionProgress::new);
        progress.setUserId(userId);
        progress.setQuestion(question);
        progress.setTotalAttempts(progress.getTotalAttempts() + 1);
        progress.setCorrectAttempts(progress.getCorrectAttempts() + (correct ? 1 : 0));
        progress.setWrongAttempts(progress.getWrongAttempts() + (correct ? 0 : 1));
        progress.setLastSelectedAnswer(selectedAnswer);
        progress.setLastCorrect(correct);
        progress.setUpdatedAt(Instant.now());
        userQuestionProgressRepository.save(progress);
    }

    @Override
    @Transactional(readOnly = true)
    public ProgressSummaryResponse getProgressSummary(Long userId) {
        Long activeQuestionBankVersionId = questionBankVersionService.getActiveQuestionBankVersion().getId();
        List<UserQuestionProgress> progressItems = userQuestionProgressRepository.findByUserId(userId).stream()
                .filter(item -> item.getQuestion().getQuestionBankVersion().getId().equals(activeQuestionBankVersionId))
                .toList();

        int totalQuestions = Math.toIntExact(questionRepository.countByQuestionBankVersion_Id(activeQuestionBankVersionId));
        int attemptedQuestions = progressItems.size();
        int correctAttempts = progressItems.stream().mapToInt(UserQuestionProgress::getCorrectAttempts).sum();
        int wrongAttempts = progressItems.stream().mapToInt(UserQuestionProgress::getWrongAttempts).sum();
        double masteryScore = attemptedQuestions == 0
                ? 0D
                : (double) correctAttempts / Math.max(correctAttempts + wrongAttempts, 1);
        return new ProgressSummaryResponse(totalQuestions, attemptedQuestions, correctAttempts, wrongAttempts, masteryScore);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChapterProgressResponse> getChapterProgress(Long userId) {
        Long activeQuestionBankVersionId = questionBankVersionService.getActiveQuestionBankVersion().getId();
        List<Question> activeQuestions = questionRepository.findByQuestionBankVersion_IdOrderByQuestionNumberAsc(activeQuestionBankVersionId);
        List<UserQuestionProgress> progressItems = userQuestionProgressRepository.findByUserId(userId).stream()
                .filter(item -> item.getQuestion().getQuestionBankVersion().getId().equals(activeQuestionBankVersionId))
                .toList();

        Map<Long, ChapterProgressAccumulator> byChapter = new LinkedHashMap<>();
        for (Question question : activeQuestions) {
            byChapter.computeIfAbsent(question.getChapter().getId(), ignored -> new ChapterProgressAccumulator(
                    question.getChapter().getId(),
                    question.getChapter().getCode()
            )).totalQuestions++;
        }
        for (UserQuestionProgress item : progressItems) {
            ChapterProgressAccumulator accumulator = byChapter.computeIfAbsent(item.getQuestion().getChapter().getId(), ignored -> new ChapterProgressAccumulator(
                    item.getQuestion().getChapter().getId(),
                    item.getQuestion().getChapter().getCode()
            ));
            accumulator.attemptedQuestions++;
            accumulator.correctAttempts += item.getCorrectAttempts();
            accumulator.wrongAttempts += item.getWrongAttempts();
        }
        return byChapter.values().stream()
                .map(accumulator -> new ChapterProgressResponse(
                        accumulator.chapterId,
                        accumulator.chapterCode,
                        accumulator.totalQuestions,
                        accumulator.attemptedQuestions,
                        accumulator.correctAttempts,
                        accumulator.wrongAttempts
                ))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<WrongQuestionDetailResponse> getWrongQuestions(Long userId) {
        Long activeQuestionBankVersionId = questionBankVersionService.getActiveQuestionBankVersion().getId();
        List<UserQuestionProgress> progressList = userQuestionProgressRepository.findByUserIdAndWrongAttemptsGreaterThan(userId, 0).stream()
                .filter(p -> p.getQuestion().getQuestionBankVersion().getId().equals(activeQuestionBankVersionId))
                .toList();

        List<Question> questions = progressList.stream().map(UserQuestionProgress::getQuestion).toList();
        Map<Long, List<AnswerResponse>> answersByQuestionId = getAnswersByQuestionId(questions);

        return progressList.stream()
                .map(p -> {
                    Question q = p.getQuestion();
                    return new WrongQuestionDetailResponse(
                            q.getId(),
                            q.getQuestionNumber(),
                            q.getContent(),
                            q.getImageUrl(),
                            q.getQuestionType(),
                            q.getIsCritical(),
                            q.getHasAnimation(),
                            q.getChapter().getId(),
                            q.getChapter().getCode(),
                            p.getWrongAttempts(),
                            p.getCorrectAttempts(),
                            p.getTotalAttempts(),
                            p.getLastCorrect(),
                            p.getUpdatedAt(),
                            answersByQuestionId.getOrDefault(q.getId(), List.of())
                    );
                })
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public UserHistoryResponse getUserHistory(Long userId) {
        List<PracticeAttempt> attempts = practiceAttemptRepository.findTop50ByUserIdOrderByCreatedAtDesc(userId);
        List<ExamSession> examSessions = examSessionRepository.findTop20ByUserIdOrderByStartedAtDesc(userId);

        List<UserHistoryResponse.PracticeHistoryItem> practiceItems = attempts.stream()
                .map(a -> new UserHistoryResponse.PracticeHistoryItem(
                        a.getId(),
                        a.getQuestion().getId(),
                        a.getQuestion().getQuestionNumber(),
                        a.getQuestion().getContent(),
                        a.getSelectedAnswer().getId(),
                        a.getSelectedAnswer().getContent(),
                        a.isCorrect(),
                        a.getCreatedAt()
                ))
                .toList();

        List<UserHistoryResponse.ExamHistoryItem> examItems = examSessions.stream()
                .map(e -> new UserHistoryResponse.ExamHistoryItem(
                        e.getId(),
                        e.getLicenseType(),
                        e.getTotalQuestions(),
                        e.getCorrectCount(),
                        e.getWrongCount(),
                        e.getCriticalWrongCount(),
                        e.getPassed(),
                        e.getState().name(),
                        e.getStartedAt(),
                        e.getFinishedAt()
                ))
                .toList();

        return new UserHistoryResponse(practiceItems, examItems);
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

    private static final class ChapterProgressAccumulator {
        private final Long chapterId;
        private final String chapterCode;
        private int totalQuestions;
        private int attemptedQuestions;
        private int correctAttempts;
        private int wrongAttempts;

        private ChapterProgressAccumulator(Long chapterId, String chapterCode) {
            this.chapterId = chapterId;
            this.chapterCode = chapterCode;
        }
    }
}
