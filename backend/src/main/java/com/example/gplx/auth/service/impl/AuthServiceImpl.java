package com.example.gplx.auth.service.impl;

import com.example.gplx.auth.dto.request.LoginRequest;
import com.example.gplx.auth.dto.request.RefreshTokenRequest;
import com.example.gplx.auth.dto.request.RegisterRequest;
import com.example.gplx.auth.dto.response.AuthResponse;
import com.example.gplx.auth.dto.response.AuthUserResponse;
import com.example.gplx.auth.entity.User;
import com.example.gplx.auth.repository.UserRepository;
import com.example.gplx.auth.security.JwtService;
import com.example.gplx.auth.service.AuthService;
import com.example.gplx.common.exception.ApiException;
import java.time.Instant;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.email())) {
            throw ApiException.conflict("Email already exists");
        }
        User user = new User();
        user.setEmail(request.email().trim().toLowerCase());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setFullName(request.fullName().trim());
        user.setUpdatedAt(Instant.now());
        User savedUser = userRepository.save(user);
        return buildAuthResponse(savedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmailIgnoreCase(request.email().trim())
                .orElseThrow(() -> ApiException.unauthorized("Invalid email or password"));
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw ApiException.unauthorized("Invalid email or password");
        }
        return buildAuthResponse(user);
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse refresh(RefreshTokenRequest request) {
        Long userId = jwtService.parseRefreshTokenSubject(request.refreshToken());
        User user = userRepository.findById(userId)
                .orElseThrow(() -> ApiException.unauthorized("User not found for refresh token"));
        return buildAuthResponse(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        return new AuthResponse(
                jwtService.generateAccessToken(user),
                jwtService.generateRefreshToken(user),
                "Bearer",
                jwtService.getAccessTokenExpirationSeconds(),
                new AuthUserResponse(user.getId(), user.getEmail(), user.getFullName())
        );
    }
}
