package com.example.gplx.auth.service;

public interface CurrentUserService {

    Long requireCurrentUserId();

    Long getCurrentUserIdOrNull();
}
