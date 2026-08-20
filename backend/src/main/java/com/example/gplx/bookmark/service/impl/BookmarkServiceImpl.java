package com.example.gplx.bookmark.service.impl;

import com.example.gplx.bookmark.entity.Bookmark;
import com.example.gplx.bookmark.repository.BookmarkRepository;
import com.example.gplx.bookmark.service.BookmarkService;
import com.example.gplx.common.exception.ApiException;
import com.example.gplx.question.dto.response.AnswerResponse;
import com.example.gplx.question.dto.response.PracticeQuestionResponse;
import com.example.gplx.question.entity.Question;
import com.example.gplx.question.mapper.QuestionMapper;
import com.example.gplx.question.repository.AnswerRepository;
import com.example.gplx.question.repository.QuestionRepository;
import com.example.gplx.question.service.QuestionBankVersionService;
import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BookmarkServiceImpl implements BookmarkService {

    private final BookmarkRepository bookmarkRepository;
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final QuestionMapper questionMapper;
    private final QuestionBankVersionService questionBankVersionService;

    @Override
    @Transactional(readOnly = true)
    public List<PracticeQuestionResponse> getBookmarks(Long userId) {
        Long activeQuestionBankVersionId = questionBankVersionService.getActiveQuestionBankVersion().getId();
        List<Question> questions = bookmarkRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(Bookmark::getQuestion)
                .filter(question -> question.getQuestionBankVersion().getId().equals(activeQuestionBankVersionId))
                .toList();
        Map<Long, List<AnswerResponse>> answersByQuestionId = getAnswersByQuestionId(questions);
        return questions.stream()
                .map(question -> questionMapper.toPracticeQuestionResponse(question, answersByQuestionId.getOrDefault(question.getId(), List.of())))
                .toList();
    }

    @Override
    @Transactional
    public void addBookmark(Long userId, Long questionId) {
        Long activeQuestionBankVersionId = questionBankVersionService.getActiveQuestionBankVersion().getId();
        Question question = questionRepository.findByIdAndQuestionBankVersion_Id(questionId, activeQuestionBankVersionId)
                .orElseThrow(() -> ApiException.notFound("Question not found"));
        if (bookmarkRepository.existsByUserIdAndQuestion_Id(userId, questionId)) {
            return;
        }
        Bookmark bookmark = new Bookmark();
        bookmark.setUserId(userId);
        bookmark.setQuestion(question);
        bookmark.setUpdatedAt(Instant.now());
        bookmarkRepository.save(bookmark);
    }

    @Override
    @Transactional
    public void removeBookmark(Long userId, Long questionId) {
        bookmarkRepository.deleteByUserIdAndQuestion_Id(userId, questionId);
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
}
