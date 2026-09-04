package com.example.gplx.user.service.impl;

import com.example.gplx.authorization.service.AuthorizationService;
import com.example.gplx.common.exception.ApiException;
import com.example.gplx.user.dto.response.UserDetailResponse;
import com.example.gplx.user.dto.response.UserSummaryResponse;
import com.example.gplx.user.entity.User;
import com.example.gplx.user.entity.UserRole;
import com.example.gplx.user.entity.UserStatus;
import com.example.gplx.user.repository.UserRepository;
import com.example.gplx.user.service.UserService;
import java.time.Instant;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final AuthorizationService authorizationService;

    @Override
    @Transactional(readOnly = true)
    public Page<UserSummaryResponse> getUsers(String keyword, UserRole role, UserStatus status, Pageable pageable) {
        String search = (keyword != null && !keyword.trim().isEmpty()) ? keyword.trim() : null;
        return userRepository.searchUsers(role, status, search, pageable)
                .map(this::toSummaryResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetailResponse getUserById(Long id) {
        User user = findUser(id);
        return toDetailResponse(user);
    }

    @Override
    @Transactional
    public UserDetailResponse updateUserRole(Long id, UserRole newRole) {
        User user = findUser(id);

        if (user.getRole() == UserRole.ADMIN) {
            throw ApiException.forbidden("Cannot modify role of the ADMIN user");
        }
        if (newRole == UserRole.ADMIN) {
            throw ApiException.badRequest("Cannot assign ADMIN role via API");
        }

        user.setRole(newRole);
        user.setUpdatedAt(Instant.now());
        User savedUser = userRepository.save(user);
        return toDetailResponse(savedUser);
    }

    @Override
    @Transactional
    public UserDetailResponse updateUserStatus(Long id, UserStatus newStatus) {
        User user = findUser(id);

        if (user.getRole() == UserRole.ADMIN && newStatus != UserStatus.ACTIVE) {
            throw ApiException.forbidden("Cannot disable or lock the ADMIN user");
        }

        user.setStatus(newStatus);
        user.setUpdatedAt(Instant.now());
        User savedUser = userRepository.save(user);
        return toDetailResponse(savedUser);
    }

    private User findUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("User not found"));
    }

    private UserSummaryResponse toSummaryResponse(User user) {
        return new UserSummaryResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole(),
                user.getStatus(),
                Boolean.TRUE.equals(user.getMustChangePassword()),
                user.getCreatedAt(),
                user.getLastLoginAt()
        );
    }

    private UserDetailResponse toDetailResponse(User user) {
        List<String> permissions = authorizationService.getPermissionsByRole(user.getRole());
        return new UserDetailResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole(),
                user.getStatus(),
                Boolean.TRUE.equals(user.getMustChangePassword()),
                user.getCreatedAt(),
                user.getUpdatedAt(),
                user.getLastLoginAt(),
                permissions
        );
    }
}
