package com.example.gplx.authorization.controller;

import com.example.gplx.authorization.dto.request.UpdateRolePermissionsRequest;
import com.example.gplx.authorization.dto.response.PermissionResponse;
import com.example.gplx.authorization.dto.response.RolePermissionsResponse;
import com.example.gplx.authorization.service.AuthorizationService;
import com.example.gplx.user.entity.UserRole;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminRolePermissionController {

    private final AuthorizationService authorizationService;

    @GetMapping("/permissions")
    @PreAuthorize("hasAuthority('ROLE_PERMISSION_VIEW')")
    public List<PermissionResponse> getAllPermissions() {
        return authorizationService.getAllPermissions();
    }

    @GetMapping("/roles/{role}/permissions")
    @PreAuthorize("hasAuthority('ROLE_PERMISSION_VIEW')")
    public RolePermissionsResponse getRolePermissions(@PathVariable UserRole role) {
        return authorizationService.getRolePermissions(role);
    }

    @PutMapping("/roles/{role}/permissions")
    @PreAuthorize("hasAuthority('ROLE_PERMISSION_UPDATE')")
    public RolePermissionsResponse updateRolePermissions(
            @PathVariable UserRole role,
            @Valid @RequestBody UpdateRolePermissionsRequest request
    ) {
        return authorizationService.updateRolePermissions(role, request.permissions());
    }
}
