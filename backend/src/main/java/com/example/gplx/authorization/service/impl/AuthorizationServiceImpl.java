package com.example.gplx.authorization.service.impl;

import com.example.gplx.authorization.dto.response.PermissionResponse;
import com.example.gplx.authorization.dto.response.RolePermissionsResponse;
import com.example.gplx.authorization.entity.Permission;
import com.example.gplx.authorization.entity.RolePermission;
import com.example.gplx.authorization.repository.PermissionRepository;
import com.example.gplx.authorization.repository.RolePermissionRepository;
import com.example.gplx.authorization.service.AuthorizationService;
import com.example.gplx.common.exception.ApiException;
import com.example.gplx.user.entity.UserRole;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthorizationServiceImpl implements AuthorizationService {

    private final PermissionRepository permissionRepository;
    private final RolePermissionRepository rolePermissionRepository;

    @Override
    @Transactional(readOnly = true)
    public List<String> getPermissionsByRole(UserRole role) {
        if (role == null) {
            return List.of();
        }
        if (role == UserRole.ADMIN) {
            return permissionRepository.findAll().stream()
                    .map(Permission::getCode)
                    .sorted()
                    .toList();
        }
        return rolePermissionRepository.findByRole(role).stream()
                .map(rp -> rp.getPermission().getCode())
                .sorted()
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PermissionResponse> getAllPermissions() {
        return permissionRepository.findAll().stream()
                .map(p -> new PermissionResponse(p.getId(), p.getCode(), p.getDescription()))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public RolePermissionsResponse getRolePermissions(UserRole role) {
        return new RolePermissionsResponse(role, getPermissionsByRole(role));
    }

    @Override
    @Transactional
    public RolePermissionsResponse updateRolePermissions(UserRole role, List<String> permissionCodes) {
        if (role == UserRole.ADMIN) {
            throw ApiException.forbidden("Cannot modify permissions for ADMIN role");
        }

        List<Permission> matchingPermissions = permissionRepository.findByCodeIn(permissionCodes);
        if (matchingPermissions.size() != permissionCodes.size()) {
            throw ApiException.badRequest("One or more permission codes are invalid");
        }

        rolePermissionRepository.deleteByRole(role);

        List<RolePermission> newMappings = matchingPermissions.stream()
                .map(p -> new RolePermission(role, p))
                .toList();
        rolePermissionRepository.saveAll(newMappings);

        return new RolePermissionsResponse(role, permissionCodes);
    }
}
