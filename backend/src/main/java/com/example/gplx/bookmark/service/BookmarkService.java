package com.example.gplx.bookmark.service;

import com.example.gplx.question.dto.response.PracticeQuestionResponse;
import java.util.List;

public interface BookmarkService {

    List<PracticeQuestionResponse> getBookmarks(Long userId);

    void addBookmark(Long userId, Long questionId);

    void removeBookmark(Long userId, Long questionId);
}
