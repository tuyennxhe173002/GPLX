package com.example.gplx.practice.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.gplx.common.exception.ApiException;
import com.example.gplx.auth.security.JwtService;
import com.example.gplx.common.exception.GlobalExceptionHandler;
import com.example.gplx.practice.dto.request.SubmitPracticeAnswerRequest;
import com.example.gplx.practice.dto.response.PracticeAnswerAnimationResponse;
import com.example.gplx.practice.dto.response.PracticeAnswerResult;
import com.example.gplx.practice.service.PracticeService;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(controllers = PracticeController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class PracticeControllerWebMvcTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PracticeService practiceService;

    @MockBean
    private com.example.gplx.auth.service.CurrentUserService currentUserService;

    @MockBean
    private JwtService jwtService;

    @Test
    void submitAnswerReturnsGradingPayload() throws Exception {
        SubmitPracticeAnswerRequest request = new SubmitPracticeAnswerRequest(101L, 201L);
        PracticeAnswerResult result = new PracticeAnswerResult(
                101L,
                201L,
                true,
                List.of(201L),
                "Giai thich",
                new PracticeAnswerAnimationResponse(true, 301L, 401L)
        );

        when(currentUserService.getCurrentUserIdOrNull()).thenReturn(99L);
        when(practiceService.submitAnswer(any(SubmitPracticeAnswerRequest.class), eq(99L))).thenReturn(result);

        mockMvc.perform(post("/api/v1/practice/answers")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.questionId").value(101))
                .andExpect(jsonPath("$.correct").value(true))
                .andExpect(jsonPath("$.correctAnswerIds[0]").value(201))
                .andExpect(jsonPath("$.explanation").value("Giai thich"))
                .andExpect(jsonPath("$.animation.available").value(true));
    }

    @Test
    void submitAnswerRejectsAnswerOutsideQuestion() throws Exception {
        SubmitPracticeAnswerRequest request = new SubmitPracticeAnswerRequest(101L, 999L);

        when(currentUserService.getCurrentUserIdOrNull()).thenReturn(99L);
        when(practiceService.submitAnswer(any(SubmitPracticeAnswerRequest.class), eq(99L)))
                .thenThrow(ApiException.badRequest("Answer does not belong to question"));

        mockMvc.perform(post("/api/v1/practice/answers")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Answer does not belong to question"));
    }
}
