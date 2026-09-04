package com.example.gplx.authorization.service;

import com.example.gplx.authorization.dto.response.PermissionResponse;
import com.example.gplx.authorization.dto.response.RolePermissionsResponse;
import com.example.gplx.user.entity.UserRole;
import java.util.List;

public interface AuthorizationService {

    List<String> getPermissionsByRole(UserRole role);

    List<PermissionResponse> getAllPermissions();

    RolePermissionsResponse getRolePermissions(UserRole role);

    RolePermissionsResponse updateRolePermissions(UserRole role, List<String> permissions);
}
