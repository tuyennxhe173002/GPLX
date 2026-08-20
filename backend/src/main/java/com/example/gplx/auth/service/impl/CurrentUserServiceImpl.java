package com.example.gplx.auth.service.impl;

import com.example.gplx.auth.security.AuthenticatedUser;
import com.example.gplx.auth.service.CurrentUserService;
import com.example.gplx.common.exception.ApiException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class CurrentUserServiceImpl implements CurrentUserService {

    @Override
    public Long requireCurrentUserId() {
        Long userId = getCurrentUserIdOrNull();
        if (userId == null) {
            throw ApiException.unauthorized("Authentication required");
        }
        return userId;
    }

    @Override
    public Long getCurrentUserIdOrNull() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof AuthenticatedUser authenticatedUser)) {
            return null;
        }
        return authenticatedUser.id();
    }
}
