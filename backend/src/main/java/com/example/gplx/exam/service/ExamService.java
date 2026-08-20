package com.example.gplx.exam.service;

import com.example.gplx.exam.dto.request.CreateExamRequest;
import com.example.gplx.exam.dto.response.ExamProfileResponse;
import com.example.gplx.exam.dto.request.SaveExamAnswerRequest;
import com.example.gplx.exam.dto.response.ExamResultResponse;
import com.example.gplx.exam.dto.response.ExamSessionResponse;
import com.example.gplx.exam.dto.response.SaveExamAnswerResponse;

public interface ExamService {

    java.util.List<ExamProfileResponse> getActiveProfiles();

    ExamSessionResponse createExam(CreateExamRequest request);

    ExamSessionResponse getExam(Long examId);

    SaveExamAnswerResponse saveAnswer(Long examId, Long questionId, SaveExamAnswerRequest request);

    ExamResultResponse submitExam(Long examId);

    ExamResultResponse getExamResult(Long examId);
}
