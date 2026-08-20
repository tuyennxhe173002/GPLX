package com.example.gplx.common.response;

import com.example.gplx.common.exception.ErrorCode;
import java.time.Instant;

public record ApiErrorResponse(
        Instant timestamp,
        int status,
        String error,
        ErrorCode code,
        String message,
        String path
) {
}
