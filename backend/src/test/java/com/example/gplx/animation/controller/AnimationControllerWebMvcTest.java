package com.example.gplx.animation.controller;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.gplx.animation.service.AnimationService;
import com.example.gplx.common.exception.ApiException;
import com.example.gplx.common.exception.GlobalExceptionHandler;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(controllers = AnimationController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class AnimationControllerWebMvcTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AnimationService animationService;

    @Test
    void getAnimationRejectsWhenAttemptCannotAccessExplanation() throws Exception {
        when(animationService.getPracticeAttemptAnimation(55L))
                .thenThrow(ApiException.forbidden("Animation explanation is not available yet"));

        mockMvc.perform(get("/api/v1/practice/attempts/55/animation"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").value("Animation explanation is not available yet"));
    }
}
