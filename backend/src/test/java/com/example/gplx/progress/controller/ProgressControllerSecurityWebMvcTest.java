package com.example.gplx.progress.controller;

import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.gplx.auth.security.JwtAuthenticationFilter;
import com.example.gplx.auth.security.JwtService;
import com.example.gplx.auth.service.CurrentUserService;
import com.example.gplx.common.exception.GlobalExceptionHandler;
import com.example.gplx.configuration.SecurityConfig;
import com.example.gplx.progress.dto.response.ProgressSummaryResponse;
import com.example.gplx.progress.service.ProgressService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(controllers = ProgressController.class)
@AutoConfigureMockMvc
@Import({GlobalExceptionHandler.class, SecurityConfig.class, JwtAuthenticationFilter.class})
class ProgressControllerSecurityWebMvcTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProgressService progressService;

    @MockBean
    private CurrentUserService currentUserService;

    @MockBean
    private JwtService jwtService;

    @Test
    void getProgressRequiresAuthentication() throws Exception {
        mockMvc.perform(get("/api/v1/me/progress"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Authentication required"));
    }

    @Test
    void getProgressReturnsSummaryForAuthenticatedUser() throws Exception {
        when(currentUserService.requireCurrentUserId()).thenReturn(99L);
        when(progressService.getProgressSummary(99L)).thenReturn(new ProgressSummaryResponse(600, 120, 90, 30, 0.75d));

        mockMvc.perform(get("/api/v1/me/progress").with(user("user@example.com")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalQuestions").value(600))
                .andExpect(jsonPath("$.attemptedQuestions").value(120));
    }
}
