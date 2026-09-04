package com.example.gplx.configuration;

import com.example.gplx.user.entity.User;
import com.example.gplx.user.entity.UserRole;
import com.example.gplx.user.entity.UserStatus;
import com.example.gplx.user.repository.UserRepository;
import java.time.Instant;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Component
@RequiredArgsConstructor
public class AdminInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email:admin@gplx.vn}")
    private String adminEmail;

    @Value("${app.admin.initial-password:Admin@123456}")
    private String adminInitialPassword;

    @Value("${app.admin.full-name:Quản Trị Viên}")
    private String adminFullName;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (userRepository.existsByRole(UserRole.ADMIN)) {
            log.info("[AdminInitializer] Singleton ADMIN account already exists in database.");
            return;
        }

        String email = adminEmail.trim().toLowerCase();
        if (userRepository.existsByEmailIgnoreCase(email)) {
            log.warn("[AdminInitializer] User with email {} already exists but is not ADMIN.", email);
            return;
        }

        User admin = new User();
        admin.setEmail(email);
        admin.setPasswordHash(passwordEncoder.encode(adminInitialPassword));
        admin.setFullName(adminFullName);
        admin.setRole(UserRole.ADMIN);
        admin.setStatus(UserStatus.ACTIVE);
        admin.setMustChangePassword(true);
        admin.setCreatedAt(Instant.now());
        admin.setUpdatedAt(Instant.now());
        userRepository.save(admin);

        log.info("[AdminInitializer] Created singleton initial ADMIN account: {}", email);
    }
}
