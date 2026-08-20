package com.example.gplx.question.controller;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.gplx.common.exception.GlobalExceptionHandler;
import com.example.gplx.question.dto.response.AnswerResponse;
import com.example.gplx.question.dto.response.PracticeQuestionResponse;
import com.example.gplx.question.entity.QuestionType;
import com.example.gplx.question.service.QuestionService;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(controllers = QuestionController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class QuestionControllerWebMvcTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private QuestionService questionService;

    @Test
    void getQuestionDoesNotLeakAnswerCorrectnessOrExplanation() throws Exception {
        PracticeQuestionResponse response = new PracticeQuestionResponse(
                101L,
                1,
                10L,
                "CH1",
                "Noi dung cau hoi",
                null,
                QuestionType.TEXT,
                false,
                List.of(
                        new AnswerResponse(201L, "A", "Dap an A", 1),
                        new AnswerResponse(202L, "B", "Dap an B", 2)
                )
        );

        when(questionService.getQuestion(101L)).thenReturn(response);

        mockMvc.perform(get("/api/v1/questions/101"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(101))
                .andExpect(jsonPath("$.answers[0].id").value(201))
                .andExpect(jsonPath("$.answers[0].label").value("A"))
                .andExpect(jsonPath("$.answers[0].isCorrect").doesNotExist())
                .andExpect(jsonPath("$.answers[0].correct").doesNotExist())
                .andExpect(jsonPath("$.answers[0].explanation").doesNotExist())
                .andExpect(jsonPath("$.explanation").doesNotExist());
    }
}
