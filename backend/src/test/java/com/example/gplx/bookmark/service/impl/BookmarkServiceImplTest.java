package com.example.gplx.bookmark.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import com.example.gplx.bookmark.entity.Bookmark;
import com.example.gplx.bookmark.repository.BookmarkRepository;
import com.example.gplx.chapter.entity.Chapter;
import com.example.gplx.question.dto.response.PracticeQuestionResponse;
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
class BookmarkServiceImplTest {

    @Mock
    private BookmarkRepository bookmarkRepository;

    @Mock
    private QuestionRepository questionRepository;

    @Mock
    private AnswerRepository answerRepository;

    @Mock
    private QuestionMapper questionMapper;

    @Mock
    private QuestionBankVersionService questionBankVersionService;

    @InjectMocks
    private BookmarkServiceImpl bookmarkService;

    @Test
    void getBookmarksShouldFilterByActiveQuestionBankVersion() {
        QuestionBankVersion activeVersion = new QuestionBankVersion();
        activeVersion.setId(1L);
        QuestionBankVersion oldVersion = new QuestionBankVersion();
        oldVersion.setId(2L);

        Chapter chapter = new Chapter();
        chapter.setId(1L);
        chapter.setCode("RULES");

        Question activeQuestion = new Question();
        activeQuestion.setId(10L);
        activeQuestion.setQuestionBankVersion(activeVersion);
        activeQuestion.setChapter(chapter);

        Question oldQuestion = new Question();
        oldQuestion.setId(11L);
        oldQuestion.setQuestionBankVersion(oldVersion);
        oldQuestion.setChapter(chapter);

        Bookmark activeBookmark = new Bookmark();
        activeBookmark.setQuestion(activeQuestion);
        Bookmark oldBookmark = new Bookmark();
        oldBookmark.setQuestion(oldQuestion);

        PracticeQuestionResponse response = new PracticeQuestionResponse(10L, 1, 1L, "RULES", "Content", null, null, false, "Explanation", List.of());

        when(questionBankVersionService.getActiveQuestionBankVersion()).thenReturn(activeVersion);
        when(bookmarkRepository.findByUserIdOrderByCreatedAtDesc(99L)).thenReturn(List.of(activeBookmark, oldBookmark));
        when(questionMapper.toPracticeQuestionResponse(activeQuestion, List.of())).thenReturn(response);

        List<PracticeQuestionResponse> bookmarks = bookmarkService.getBookmarks(99L);

        assertThat(bookmarks).containsExactly(response);
    }
}
