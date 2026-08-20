package com.example.gplx.question.service.impl;

import com.example.gplx.question.entity.QuestionBankVersion;
import com.example.gplx.question.repository.QuestionBankVersionRepository;
import com.example.gplx.question.service.QuestionBankVersionService;
import com.example.gplx.common.exception.ApiException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class QuestionBankVersionServiceImpl implements QuestionBankVersionService {

    private final QuestionBankVersionRepository questionBankVersionRepository;

    @Override
    @Transactional(readOnly = true)
    public QuestionBankVersion getActiveQuestionBankVersion() {
        return questionBankVersionRepository.findFirstByIsActiveTrueOrderByIdAsc()
                .orElseThrow(() -> ApiException.notFound("Active question bank version not found"));
    }
}
