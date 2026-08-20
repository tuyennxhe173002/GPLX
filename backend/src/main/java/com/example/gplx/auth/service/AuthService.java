package com.example.gplx.auth.service;

import com.example.gplx.auth.dto.request.LoginRequest;
import com.example.gplx.auth.dto.request.RefreshTokenRequest;
import com.example.gplx.auth.dto.request.RegisterRequest;
import com.example.gplx.auth.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse refresh(RefreshTokenRequest request);
}
