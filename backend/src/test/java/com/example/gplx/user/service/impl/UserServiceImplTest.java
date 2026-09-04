package com.example.gplx.user.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import com.example.gplx.authorization.service.AuthorizationService;
import com.example.gplx.common.exception.ApiException;
import com.example.gplx.user.dto.response.UserDetailResponse;
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

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private AuthorizationService authorizationService;

    @InjectMocks
    private UserServiceImpl userService;

    @Test
    void updateUserRoleToTeacherShouldSucceedForStudent() {
        User student = new User();
        student.setId(2L);
        student.setEmail("student@gplx.vn");
        student.setRole(UserRole.STUDENT);
        student.setStatus(UserStatus.ACTIVE);

        when(userRepository.findById(2L)).thenReturn(Optional.of(student));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(authorizationService.getPermissionsByRole(UserRole.TEACHER)).thenReturn(List.of("VIDEO_CREATE", "VIDEO_VIEW"));

        UserDetailResponse response = userService.updateUserRole(2L, UserRole.TEACHER);

        assertThat(response.role()).isEqualTo(UserRole.TEACHER);
        assertThat(response.permissions()).contains("VIDEO_CREATE");
    }

    @Test
    void updateUserRoleShouldRejectModifyingAdminRole() {
        User admin = new User();
        admin.setId(1L);
        admin.setEmail("admin@gplx.vn");
        admin.setRole(UserRole.ADMIN);

        when(userRepository.findById(1L)).thenReturn(Optional.of(admin));

        ApiException exception = assertThrows(ApiException.class, () -> userService.updateUserRole(1L, UserRole.STUDENT));

        assertThat(exception.getMessage()).contains("ADMIN");
    }

    @Test
    void updateUserRoleShouldRejectAssigningAdminRole() {
        User student = new User();
        student.setId(2L);
        student.setEmail("student@gplx.vn");
        student.setRole(UserRole.STUDENT);

        when(userRepository.findById(2L)).thenReturn(Optional.of(student));

        ApiException exception = assertThrows(ApiException.class, () -> userService.updateUserRole(2L, UserRole.ADMIN));

        assertThat(exception.getMessage()).contains("ADMIN");
    }

    @Test
    void updateUserStatusShouldRejectDisablingAdmin() {
        User admin = new User();
        admin.setId(1L);
        admin.setEmail("admin@gplx.vn");
        admin.setRole(UserRole.ADMIN);

        when(userRepository.findById(1L)).thenReturn(Optional.of(admin));

        ApiException exception = assertThrows(ApiException.class, () -> userService.updateUserStatus(1L, UserStatus.DISABLED));

        assertThat(exception.getMessage()).contains("ADMIN");
    }
}
