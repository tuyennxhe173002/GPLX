package com.example.gplx.user.controller;

import com.example.gplx.user.dto.request.UpdateUserRoleRequest;
import com.example.gplx.user.dto.request.UpdateUserStatusRequest;
import com.example.gplx.user.dto.response.UserDetailResponse;
import com.example.gplx.user.dto.response.UserSummaryResponse;
import com.example.gplx.user.entity.UserRole;
import com.example.gplx.user.entity.UserStatus;
import com.example.gplx.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasAuthority('ACCOUNT_VIEW')")
    public Page<UserSummaryResponse> getUsers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) UserRole role,
            @RequestParam(required = false) UserStatus status,
            @PageableDefault(size = 20, sort = "id", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return userService.getUsers(search, role, status, pageable);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ACCOUNT_VIEW')")
    public UserDetailResponse getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PutMapping("/{id}/role")
    @PreAuthorize("hasAuthority('ACCOUNT_ROLE_CHANGE')")
    public UserDetailResponse updateUserRole(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRoleRequest request
    ) {
        return userService.updateUserRole(id, request.role());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ACCOUNT_STATUS_CHANGE')")
    public UserDetailResponse updateUserStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserStatusRequest request
    ) {
        return userService.updateUserStatus(id, request.status());
    }
}
