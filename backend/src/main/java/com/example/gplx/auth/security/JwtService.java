package com.example.gplx.auth.security;

import com.example.gplx.common.exception.ApiException;
import com.example.gplx.user.entity.User;
import com.example.gplx.user.entity.UserRole;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    private final Key signingKey;
    private final long accessTokenExpirationSeconds;
    private final long refreshTokenExpirationSeconds;

    public JwtService(
            @Value("${app.auth.jwt-secret:U29tZVN1cGVyU2VjcmV0S2V5Rm9yR1BMWFN1cGVyU2VjcmV0S2V5MTIzNDU2Nzg=}") String jwtSecret,
            @Value("${app.auth.access-token-expiration-seconds:3600}") long accessTokenExpirationSeconds,
            @Value("${app.auth.refresh-token-expiration-seconds:2592000}") long refreshTokenExpirationSeconds
    ) {
        this.signingKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
        this.accessTokenExpirationSeconds = accessTokenExpirationSeconds;
        this.refreshTokenExpirationSeconds = refreshTokenExpirationSeconds;
    }

    public String generateAccessToken(User user, List<String> permissions) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(String.valueOf(user.getId()))
                .claim("email", user.getEmail())
                .claim("role", user.getRole().name())
                .claim("permissions", permissions)
                .claim("type", "access")
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusSeconds(accessTokenExpirationSeconds)))
                .signWith(signingKey)
                .compact();
    }

    public String generateRefreshToken(User user) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(String.valueOf(user.getId()))
                .claim("email", user.getEmail())
                .claim("type", "refresh")
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusSeconds(refreshTokenExpirationSeconds)))
                .signWith(signingKey)
                .compact();
    }

    @SuppressWarnings("unchecked")
    public AuthenticatedUser parseAccessToken(String token) {
        Claims claims = parseClaims(token);
        if (!"access".equals(claims.get("type", String.class))) {
            throw ApiException.unauthorized("Invalid access token");
        }

        Long userId = Long.valueOf(claims.getSubject());
        String email = claims.get("email", String.class);
        String roleStr = claims.get("role", String.class);
        UserRole role = roleStr != null ? UserRole.valueOf(roleStr) : UserRole.STUDENT;
        List<String> permissions = claims.get("permissions", List.class);
        if (permissions == null) {
            permissions = List.of();
        }

        return new AuthenticatedUser(userId, email, role, permissions);
    }

    public Long parseRefreshTokenSubject(String token) {
        Claims claims = parseClaims(token);
        if (!"refresh".equals(claims.get("type", String.class))) {
            throw ApiException.unauthorized("Invalid refresh token");
        }
        return Long.valueOf(claims.getSubject());
    }

    public long getAccessTokenExpirationSeconds() {
        return accessTokenExpirationSeconds;
    }

    private Claims parseClaims(String token) {
        try {
            return Jwts.parser()
                    .verifyWith((javax.crypto.SecretKey) signingKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (Exception exception) {
            throw ApiException.unauthorized("Invalid or expired token");
        }
    }
}
