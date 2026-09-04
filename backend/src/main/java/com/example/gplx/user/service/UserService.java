package com.example.gplx.user.service;

import com.example.gplx.user.dto.response.UserDetailResponse;
import com.example.gplx.user.dto.response.UserSummaryResponse;
import com.example.gplx.user.entity.UserRole;
import com.example.gplx.user.entity.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {

    Page<UserSummaryResponse> getUsers(String keyword, UserRole role, UserStatus status, Pageable pageable);

    UserDetailResponse getUserById(Long id);

    UserDetailResponse updateUserRole(Long id, UserRole newRole);

    UserDetailResponse updateUserStatus(Long id, UserStatus newStatus);
}
