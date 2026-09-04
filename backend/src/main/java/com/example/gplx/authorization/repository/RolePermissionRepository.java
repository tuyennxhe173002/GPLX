package com.example.gplx.authorization.repository;

import com.example.gplx.authorization.entity.RolePermission;
import com.example.gplx.user.entity.UserRole;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RolePermissionRepository extends JpaRepository<RolePermission, Long> {

    List<RolePermission> findByRole(UserRole role);

    void deleteByRole(UserRole role);
}
