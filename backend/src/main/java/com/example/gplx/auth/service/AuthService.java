package com.example.gplx.auth.service;

import com.example.gplx.auth.dto.request.ChangePasswordRequest;
import com.example.gplx.auth.dto.request.ForgotPasswordRequest;
import com.example.gplx.auth.dto.request.LoginRequest;
import com.example.gplx.auth.dto.request.RefreshTokenRequest;
import com.example.gplx.auth.dto.request.RegisterRequest;
import com.example.gplx.auth.dto.request.ResetPasswordRequest;
import com.example.gplx.auth.dto.response.AuthResponse;
import com.example.gplx.auth.dto.response.CurrentUserResponse;
import com.example.gplx.auth.dto.response.GenericMessageResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse refresh(RefreshTokenRequest request);

    CurrentUserResponse getCurrentUser(Long userId);

    GenericMessageResponse forgotPassword(ForgotPasswordRequest request);

    GenericMessageResponse resetPassword(ResetPasswordRequest request);

    GenericMessageResponse changePassword(Long userId, ChangePasswordRequest request);
}
