package com.example.gplx.exam.controller;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.gplx.common.exception.GlobalExceptionHandler;
import com.example.gplx.exam.dto.request.SaveExamAnswerRequest;
import com.example.gplx.exam.dto.response.ExamResultQuestionResponse;
import com.example.gplx.exam.dto.response.ExamResultResponse;
import com.example.gplx.exam.dto.response.SaveExamAnswerResponse;
import com.example.gplx.exam.entity.ExamSessionState;
import com.example.gplx.exam.service.ExamService;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(controllers = ExamController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class ExamControllerWebMvcTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ExamService examService;

    @Test
    void saveAnswerDoesNotLeakCorrectnessBeforeSubmit() throws Exception {
        when(examService.saveAnswer(eq(100L), eq(200L), eq(new SaveExamAnswerRequest(300L))))
                .thenReturn(new SaveExamAnswerResponse(true));

        mockMvc.perform(put("/api/v1/exams/100/answers/200")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(new SaveExamAnswerRequest(300L))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.saved").value(true))
                .andExpect(jsonPath("$.correct").doesNotExist())
                .andExpect(jsonPath("$.explanation").doesNotExist())
                .andExpect(jsonPath("$.correctAnswerIds").doesNotExist());
    }

    @Test
    void getExamResultReturnsReviewAfterSubmit() throws Exception {
        ExamResultResponse response = new ExamResultResponse(
                100L,
                "B2",
                ExamSessionState.SUBMITTED,
                48,
                false,
                1,
                List.of(new ExamResultQuestionResponse(200L, 3, 301L, List.of(302L), false, "Loi giai exam"))
        );

        when(examService.getExamResult(100L)).thenReturn(response);

        mockMvc.perform(get("/api/v1/exams/100/result"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.state").value("SUBMITTED"))
                .andExpect(jsonPath("$.questions[0].correct").value(false))
                .andExpect(jsonPath("$.questions[0].correctAnswerIds[0]").value(302))
                .andExpect(jsonPath("$.questions[0].explanation").value("Loi giai exam"));
    }
}
