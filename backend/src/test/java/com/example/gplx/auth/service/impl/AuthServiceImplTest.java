package com.example.gplx.auth.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

import com.example.gplx.auth.dto.request.ChangePasswordRequest;
import com.example.gplx.auth.dto.request.LoginRequest;
import com.example.gplx.auth.dto.request.RegisterRequest;
import com.example.gplx.auth.dto.response.AuthResponse;
import com.example.gplx.auth.dto.response.GenericMessageResponse;
import com.example.gplx.auth.repository.PasswordResetTokenRepository;
import com.example.gplx.auth.security.JwtService;
import com.example.gplx.authorization.service.AuthorizationService;
import com.example.gplx.common.exception.ApiException;
import com.example.gplx.user.entity.User;
import com.example.gplx.user.entity.UserRole;
import com.example.gplx.user.entity.UserStatus;
import com.example.gplx.user.repository.UserRepository;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthorizationService authorizationService;

    @InjectMocks
    private AuthServiceImpl authService;

    @Test
    void registerShouldCreateUserAndReturnTokens() {
        RegisterRequest request = new RegisterRequest("Test@Email.com", "password123", "Test User");
        User savedUser = new User();
        savedUser.setId(10L);
        savedUser.setEmail("test@email.com");
        savedUser.setFullName("Test User");
        savedUser.setRole(UserRole.STUDENT);
        savedUser.setStatus(UserStatus.ACTIVE);

        List<String> defaultPerms = List.of("QUESTION_VIEW", "VIDEO_VIEW");

        when(userRepository.existsByEmailIgnoreCase(request.email())).thenReturn(false);
        when(passwordEncoder.encode(request.password())).thenReturn("encoded-password");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(authorizationService.getPermissionsByRole(UserRole.STUDENT)).thenReturn(defaultPerms);
        when(jwtService.generateAccessToken(savedUser, defaultPerms)).thenReturn("access-token");
        when(jwtService.generateRefreshToken(savedUser)).thenReturn("refresh-token");
        when(jwtService.getAccessTokenExpirationSeconds()).thenReturn(3600L);

        AuthResponse response = authService.register(request);

        assertThat(response.accessToken()).isEqualTo("access-token");
        assertThat(response.refreshToken()).isEqualTo("refresh-token");
        assertThat(response.user().email()).isEqualTo("test@email.com");
        assertThat(response.user().role()).isEqualTo(UserRole.STUDENT);
        assertThat(response.user().permissions()).containsExactlyElementsOf(defaultPerms);
    }

    @Test
    void loginShouldRejectInvalidPassword() {
        User user = new User();
        user.setId(1L);
        user.setEmail("user@example.com");
        user.setPasswordHash("encoded");
        user.setRole(UserRole.STUDENT);
        user.setStatus(UserStatus.ACTIVE);

        when(userRepository.findByEmailIgnoreCase("user@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong-password", "encoded")).thenReturn(false);

        ApiException exception = assertThrows(ApiException.class, () -> authService.login(new LoginRequest("user@example.com", "wrong-password")));

        assertThat(exception.getMessage()).isEqualTo("Invalid email or password");
    }

    @Test
    void loginShouldRejectDisabledAccount() {
        User user = new User();
        user.setId(1L);
        user.setEmail("user@example.com");
        user.setPasswordHash("encoded");
        user.setRole(UserRole.STUDENT);
        user.setStatus(UserStatus.DISABLED);

        when(userRepository.findByEmailIgnoreCase("user@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password123", "encoded")).thenReturn(true);

        ApiException exception = assertThrows(ApiException.class, () -> authService.login(new LoginRequest("user@example.com", "password123")));

        assertThat(exception.getMessage()).contains("disabled");
    }

    @Test
    void changePasswordShouldValidateCurrentPassword() {
        User user = new User();
        user.setId(1L);
        user.setPasswordHash("old-encoded");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong-current", "old-encoded")).thenReturn(false);

        ApiException exception = assertThrows(ApiException.class, () -> authService.changePassword(1L, new ChangePasswordRequest("wrong-current", "new-pass", "new-pass")));

        assertThat(exception.getMessage()).contains("hiện tại");
    }
}
