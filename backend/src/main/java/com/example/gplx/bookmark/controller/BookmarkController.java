package com.example.gplx.bookmark.controller;

import com.example.gplx.auth.service.CurrentUserService;
import com.example.gplx.bookmark.service.BookmarkService;
import com.example.gplx.question.dto.response.PracticeQuestionResponse;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/me/bookmarks")
@RequiredArgsConstructor
public class BookmarkController {

    private final BookmarkService bookmarkService;
    private final CurrentUserService currentUserService;

    @GetMapping
    public List<PracticeQuestionResponse> getBookmarks() {
        return bookmarkService.getBookmarks(currentUserService.requireCurrentUserId());
    }

    @PostMapping("/{questionId}")
    @ResponseStatus(HttpStatus.OK)
    public void addBookmark(@PathVariable Long questionId) {
        bookmarkService.addBookmark(currentUserService.requireCurrentUserId(), questionId);
    }

    @DeleteMapping("/{questionId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeBookmark(@PathVariable Long questionId) {
        bookmarkService.removeBookmark(currentUserService.requireCurrentUserId(), questionId);
    }
}
