package com.example.gplx.auth.controller;

import com.example.gplx.auth.dto.request.ChangePasswordRequest;
import com.example.gplx.auth.dto.request.ForgotPasswordRequest;
import com.example.gplx.auth.dto.request.LoginRequest;
import com.example.gplx.auth.dto.request.RefreshTokenRequest;
import com.example.gplx.auth.dto.request.RegisterRequest;
import com.example.gplx.auth.dto.request.ResetPasswordRequest;
import com.example.gplx.auth.dto.response.AuthResponse;
import com.example.gplx.auth.dto.response.CurrentUserResponse;
import com.example.gplx.auth.dto.response.GenericMessageResponse;
import com.example.gplx.auth.service.AuthService;
import com.example.gplx.auth.service.CurrentUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final CurrentUserService currentUserService;

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/refresh")
    public AuthResponse refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return authService.refresh(request);
    }

    @GetMapping("/me")
    public CurrentUserResponse getCurrentUser() {
        return authService.getCurrentUser(currentUserService.requireCurrentUserId());
    }

    @PostMapping("/forgot-password")
    public GenericMessageResponse forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        return authService.forgotPassword(request);
    }

    @PostMapping("/reset-password")
    public GenericMessageResponse resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        return authService.resetPassword(request);
    }

    @PutMapping("/password")
    public GenericMessageResponse changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        return authService.changePassword(currentUserService.requireCurrentUserId(), request);
    }
}
