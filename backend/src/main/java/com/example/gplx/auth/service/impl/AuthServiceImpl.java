package com.example.gplx.auth.service.impl;

import com.example.gplx.auth.dto.request.ChangePasswordRequest;
import com.example.gplx.auth.dto.request.ForgotPasswordRequest;
import com.example.gplx.auth.dto.request.LoginRequest;
import com.example.gplx.auth.dto.request.RefreshTokenRequest;
import com.example.gplx.auth.dto.request.RegisterRequest;
import com.example.gplx.auth.dto.request.ResetPasswordRequest;
import com.example.gplx.auth.dto.response.AuthResponse;
import com.example.gplx.auth.dto.response.AuthUserResponse;
import com.example.gplx.auth.dto.response.CurrentUserResponse;
import com.example.gplx.auth.dto.response.GenericMessageResponse;
import com.example.gplx.auth.entity.PasswordResetToken;
import com.example.gplx.auth.repository.PasswordResetTokenRepository;
import com.example.gplx.auth.security.JwtService;
import com.example.gplx.auth.service.AuthService;
import com.example.gplx.authorization.service.AuthorizationService;
import com.example.gplx.common.exception.ApiException;
import com.example.gplx.user.entity.User;
import com.example.gplx.user.entity.UserRole;
import com.example.gplx.user.entity.UserStatus;
import com.example.gplx.user.repository.UserRepository;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HexFormat;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthorizationService authorizationService;

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
        user.setRole(UserRole.STUDENT);
        user.setStatus(UserStatus.ACTIVE);
        user.setMustChangePassword(false);
        user.setCreatedAt(Instant.now());
        user.setUpdatedAt(Instant.now());
        User savedUser = userRepository.save(user);

        List<String> permissions = authorizationService.getPermissionsByRole(savedUser.getRole());
        return buildAuthResponse(savedUser, permissions);
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmailIgnoreCase(request.email().trim())
                .orElseThrow(() -> ApiException.unauthorized("Invalid email or password"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw ApiException.unauthorized("Invalid email or password");
        }

        if (user.getStatus() == UserStatus.DISABLED || user.getStatus() == UserStatus.LOCKED) {
            throw ApiException.forbidden("Account is disabled or locked");
        }

        user.setLastLoginAt(Instant.now());
        userRepository.save(user);

        List<String> permissions = authorizationService.getPermissionsByRole(user.getRole());
        return buildAuthResponse(user, permissions);
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse refresh(RefreshTokenRequest request) {
        Long userId = jwtService.parseRefreshTokenSubject(request.refreshToken());
        User user = userRepository.findById(userId)
                .orElseThrow(() -> ApiException.unauthorized("User not found for refresh token"));

        if (user.getStatus() == UserStatus.DISABLED || user.getStatus() == UserStatus.LOCKED) {
            throw ApiException.forbidden("Account is disabled or locked");
        }

        List<String> permissions = authorizationService.getPermissionsByRole(user.getRole());
        return buildAuthResponse(user, permissions);
    }

    @Override
    @Transactional(readOnly = true)
    public CurrentUserResponse getCurrentUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> ApiException.notFound("User not found"));
        List<String> permissions = authorizationService.getPermissionsByRole(user.getRole());
        return new CurrentUserResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole(),
                user.getStatus(),
                Boolean.TRUE.equals(user.getMustChangePassword()),
                permissions,
                user.getCreatedAt(),
                user.getLastLoginAt()
        );
    }

    @Override
    @Transactional
    public GenericMessageResponse forgotPassword(ForgotPasswordRequest request) {
        String email = request.email().trim().toLowerCase();
        userRepository.findByEmailIgnoreCase(email).ifPresent(user -> {
            String rawToken = UUID.randomUUID().toString().replace("-", "") + UUID.randomUUID().toString().replace("-", "");
            String tokenHash = hashToken(rawToken);

            PasswordResetToken resetToken = new PasswordResetToken(
                    user,
                    tokenHash,
                    Instant.now().plus(30, ChronoUnit.MINUTES)
            );
            passwordResetTokenRepository.save(resetToken);

            log.info("[PasswordReset] Generated reset token for {}: {} (Hash: {})", email, rawToken, tokenHash);
        });

        return new GenericMessageResponse("Nếu email tồn tại, hướng dẫn đặt lại mật khẩu sẽ được gửi.");
    }

    @Override
    @Transactional
    public GenericMessageResponse resetPassword(ResetPasswordRequest request) {
        if (!request.newPassword().equals(request.confirmPassword())) {
            throw ApiException.badRequest("Mật khẩu xác nhận không khớp");
        }

        String tokenHash = hashToken(request.token().trim());
        PasswordResetToken resetToken = passwordResetTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> ApiException.badRequest("Mã đặt lại mật khẩu không hợp lệ hoặc đã hết hạn"));

        if (resetToken.getUsedAt() != null || resetToken.getExpiresAt().isBefore(Instant.now())) {
            throw ApiException.badRequest("Mã đặt lại mật khẩu không hợp lệ hoặc đã hết hạn");
        }

        User user = resetToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        user.setMustChangePassword(false);
        user.setUpdatedAt(Instant.now());
        userRepository.save(user);

        resetToken.setUsedAt(Instant.now());
        passwordResetTokenRepository.save(resetToken);

        return new GenericMessageResponse("Đặt lại mật khẩu thành công. Vui lòng đăng nhập với mật khẩu mới.");
    }

    @Override
    @Transactional
    public GenericMessageResponse changePassword(Long userId, ChangePasswordRequest request) {
        if (!request.newPassword().equals(request.confirmPassword())) {
            throw ApiException.badRequest("Mật khẩu mới xác nhận không khớp");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> ApiException.notFound("User not found"));

        if (!passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw ApiException.badRequest("Mật khẩu hiện tại không chính xác");
        }

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        user.setMustChangePassword(false);
        user.setUpdatedAt(Instant.now());
        userRepository.save(user);

        return new GenericMessageResponse("Đổi mật khẩu thành công.");
    }

    private AuthResponse buildAuthResponse(User user, List<String> permissions) {
        return new AuthResponse(
                jwtService.generateAccessToken(user, permissions),
                jwtService.generateRefreshToken(user),
                "Bearer",
                jwtService.getAccessTokenExpirationSeconds(),
                new AuthUserResponse(user.getId(), user.getEmail(), user.getFullName(), user.getRole(), permissions)
        );
    }

    private String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 not available", e);
        }
    }
}
