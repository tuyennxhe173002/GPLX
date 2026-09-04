package com.example.gplx.authorization.repository;

import com.example.gplx.authorization.entity.Permission;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PermissionRepository extends JpaRepository<Permission, Long> {

    Optional<Permission> findByCode(String code);

    List<Permission> findByCodeIn(Collection<String> codes);
}
