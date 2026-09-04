package com.example.gplx.progress.controller;

import com.example.gplx.auth.service.CurrentUserService;
import com.example.gplx.progress.dto.response.ChapterProgressResponse;
import com.example.gplx.progress.dto.response.ProgressSummaryResponse;
import com.example.gplx.progress.dto.response.UserHistoryResponse;
import com.example.gplx.progress.dto.response.WrongQuestionDetailResponse;
import com.example.gplx.progress.service.ProgressService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/me")
@RequiredArgsConstructor
public class ProgressController {

    private final ProgressService progressService;
    private final CurrentUserService currentUserService;

    @GetMapping("/progress")
    public ProgressSummaryResponse getProgressSummary() {
        return progressService.getProgressSummary(currentUserService.requireCurrentUserId());
    }

    @GetMapping("/progress/chapters")
    public List<ChapterProgressResponse> getChapterProgress() {
        return progressService.getChapterProgress(currentUserService.requireCurrentUserId());
    }

    @GetMapping("/wrong-questions")
    public List<WrongQuestionDetailResponse> getWrongQuestions() {
        return progressService.getWrongQuestions(currentUserService.requireCurrentUserId());
    }

    @GetMapping("/history")
    public UserHistoryResponse getUserHistory() {
        return progressService.getUserHistory(currentUserService.requireCurrentUserId());
    }
}
