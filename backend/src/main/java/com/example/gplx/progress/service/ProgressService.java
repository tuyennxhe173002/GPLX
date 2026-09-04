package com.example.gplx.progress.service;

import com.example.gplx.progress.dto.response.ChapterProgressResponse;
import com.example.gplx.progress.dto.response.ProgressSummaryResponse;
import com.example.gplx.progress.dto.response.UserHistoryResponse;
import com.example.gplx.progress.dto.response.WrongQuestionDetailResponse;
import com.example.gplx.question.entity.Answer;
import com.example.gplx.question.entity.Question;
import java.util.List;

public interface ProgressService {

    void recordPracticeAttempt(Long userId, Question question, Answer selectedAnswer, boolean correct);

    ProgressSummaryResponse getProgressSummary(Long userId);

    List<ChapterProgressResponse> getChapterProgress(Long userId);

    List<WrongQuestionDetailResponse> getWrongQuestions(Long userId);

    UserHistoryResponse getUserHistory(Long userId);
}
