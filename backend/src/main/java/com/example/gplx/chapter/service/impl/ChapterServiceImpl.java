package com.example.gplx.chapter.service.impl;

import com.example.gplx.chapter.dto.response.ChapterResponse;
import com.example.gplx.chapter.mapper.ChapterMapper;
import com.example.gplx.chapter.repository.ChapterRepository;
import com.example.gplx.chapter.service.ChapterService;
import com.example.gplx.question.service.QuestionBankVersionService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ChapterServiceImpl implements ChapterService {

    private final ChapterRepository chapterRepository;
    private final ChapterMapper chapterMapper;
    private final QuestionBankVersionService questionBankVersionService;

    @Override
    @Transactional(readOnly = true)
    public List<ChapterResponse> getChapters() {
        Long activeQuestionBankVersionId = questionBankVersionService.getActiveQuestionBankVersion().getId();
        return chapterRepository.findByQuestionBankVersion_IdOrderBySortOrderAsc(activeQuestionBankVersionId).stream()
                .map(chapterMapper::toResponse)
                .toList();
    }
}
