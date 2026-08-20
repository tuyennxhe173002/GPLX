package com.example.gplx.progress.service.impl;

import com.example.gplx.progress.dto.response.ChapterProgressResponse;
import com.example.gplx.progress.dto.response.ProgressSummaryResponse;
import com.example.gplx.progress.entity.UserQuestionProgress;
import com.example.gplx.progress.repository.UserQuestionProgressRepository;
import com.example.gplx.progress.service.ProgressService;
import com.example.gplx.question.dto.response.AnswerResponse;
import com.example.gplx.question.dto.response.PracticeQuestionResponse;
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
    public List<PracticeQuestionResponse> getWrongQuestions(Long userId) {
        Long activeQuestionBankVersionId = questionBankVersionService.getActiveQuestionBankVersion().getId();
        List<Question> questions = userQuestionProgressRepository.findByUserIdAndWrongAttemptsGreaterThan(userId, 0).stream()
                .map(UserQuestionProgress::getQuestion)
                .filter(question -> question.getQuestionBankVersion().getId().equals(activeQuestionBankVersionId))
                .toList();
        Map<Long, List<AnswerResponse>> answersByQuestionId = getAnswersByQuestionId(questions);
        return questions.stream()
                .map(question -> questionMapper.toPracticeQuestionResponse(question, answersByQuestionId.getOrDefault(question.getId(), List.of())))
                .toList();
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
