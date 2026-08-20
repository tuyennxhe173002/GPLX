package com.example.gplx.question.service.impl;

import com.example.gplx.question.dto.response.AnswerResponse;
import com.example.gplx.question.dto.response.PracticeQuestionResponse;
import com.example.gplx.question.entity.Question;
import com.example.gplx.question.mapper.QuestionMapper;
import com.example.gplx.question.repository.AnswerRepository;
import com.example.gplx.question.repository.QuestionRepository;
import com.example.gplx.common.exception.ApiException;
import com.example.gplx.question.service.QuestionBankVersionService;
import com.example.gplx.question.service.QuestionService;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {

    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final QuestionMapper questionMapper;
    private final QuestionBankVersionService questionBankVersionService;

    @Override
    @Transactional(readOnly = true)
    public Page<PracticeQuestionResponse> getQuestions(Long chapterId, Pageable pageable) {
        Long activeQuestionBankVersionId = questionBankVersionService.getActiveQuestionBankVersion().getId();
        Page<Question> questions = chapterId == null
                ? questionRepository.findByQuestionBankVersion_Id(activeQuestionBankVersionId, pageable)
                : questionRepository.findByQuestionBankVersion_IdAndChapter_Id(activeQuestionBankVersionId, chapterId, pageable);
        Map<Long, List<AnswerResponse>> answersByQuestionId = getAnswersByQuestionId(questions.getContent());
        return questions.map(question -> toResponse(question, answersByQuestionId));
    }

    @Override
    @Transactional(readOnly = true)
    public PracticeQuestionResponse getQuestion(Long id) {
        Long activeQuestionBankVersionId = questionBankVersionService.getActiveQuestionBankVersion().getId();
        Question question = questionRepository.findByIdAndQuestionBankVersion_Id(id, activeQuestionBankVersionId)
                .orElseThrow(() -> ApiException.notFound("Question not found"));
        Map<Long, List<AnswerResponse>> answersByQuestionId = getAnswersByQuestionId(List.of(question));
        return toResponse(question, answersByQuestionId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PracticeQuestionResponse> getRandomQuestions(int size) {
        Long activeQuestionBankVersionId = questionBankVersionService.getActiveQuestionBankVersion().getId();
        List<Question> questions = questionRepository.findRandomByQuestionBankVersionId(activeQuestionBankVersionId, Pageable.ofSize(size));
        Map<Long, List<AnswerResponse>> answersByQuestionId = getAnswersByQuestionId(questions);
        return questions.stream()
                .map(question -> toResponse(question, answersByQuestionId))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PracticeQuestionResponse> getCriticalQuestions() {
        Long activeQuestionBankVersionId = questionBankVersionService.getActiveQuestionBankVersion().getId();
        List<Question> questions = questionRepository.findByQuestionBankVersion_IdAndIsCriticalTrueOrderByQuestionNumberAsc(activeQuestionBankVersionId);
        Map<Long, List<AnswerResponse>> answersByQuestionId = getAnswersByQuestionId(questions);
        return questions.stream()
                .map(question -> toResponse(question, answersByQuestionId))
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

    private PracticeQuestionResponse toResponse(Question question, Map<Long, List<AnswerResponse>> answersByQuestionId) {
        return questionMapper.toPracticeQuestionResponse(
                question,
                answersByQuestionId.getOrDefault(question.getId(), List.of())
        );
    }
}
