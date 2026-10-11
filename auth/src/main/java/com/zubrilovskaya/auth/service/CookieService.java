package com.zubrilovskaya.auth.service;

import com.zubrilovskaya.auth.config.CookieProperties;
import com.zubrilovskaya.auth.config.JwtProperties;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;
import org.springframework.web.util.WebUtils;

import java.time.Duration;
import java.time.Instant;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CookieService {

    public static final String ACCESS_COOKIE = "access_token";
    public static final String REFRESH_COOKIE = "refresh_token";

    private static final String ACCESS_PATH = "/";
    private static final String REFRESH_PATH = "/auth";

    private final CookieProperties cookieProps;
    private final JwtProperties jwtProps;

    public void addAuthCookies(HttpServletResponse response, String accessToken,
                               String refreshToken, Instant refreshExpiresAt) {
        Duration refreshMaxAge = Duration.between(Instant.now(), refreshExpiresAt);
        if (refreshMaxAge.isNegative()) {
            refreshMaxAge = Duration.ZERO;
        }
        add(response, build(ACCESS_COOKIE, accessToken, ACCESS_PATH, jwtProps.getAccessTtl()));
        add(response, build(REFRESH_COOKIE, refreshToken, REFRESH_PATH, refreshMaxAge));
    }

    public void clearAuthCookies(HttpServletResponse response) {
        add(response, build(ACCESS_COOKIE, "", ACCESS_PATH, Duration.ZERO));
        add(response, build(REFRESH_COOKIE, "", REFRESH_PATH, Duration.ZERO));
    }

    public Optional<String> readRefreshToken(HttpServletRequest request) {
        Cookie cookie = WebUtils.getCookie(request, REFRESH_COOKIE);
        if (cookie == null || cookie.getValue().isBlank()) {
            return Optional.empty();
        }
        return Optional.of(cookie.getValue());
    }

    private ResponseCookie build(String name, String value, String path, Duration maxAge) {
        return ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(cookieProps.isSecure())
                .sameSite(cookieProps.getSameSite())
                .path(path)
                .maxAge(maxAge)
                .build();
    }

    private void add(HttpServletResponse response, ResponseCookie cookie) {
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}