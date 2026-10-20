package com.zubrilovskaya.auth.controller;

import com.zubrilovskaya.auth.dto.request.LoginRequest;
import com.zubrilovskaya.auth.dto.request.RegisterRequest;
import com.zubrilovskaya.auth.dto.response.AuthResponse;
import com.zubrilovskaya.auth.exception.UnauthorizedException;
import com.zubrilovskaya.auth.service.AuthService;
import com.zubrilovskaya.auth.service.CookieService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final CookieService cookieService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request,
            @RequestHeader(value = HttpHeaders.USER_AGENT, required = false) String userAgent,
            HttpServletResponse response) {
        AuthResponse result = authService.register(request, userAgent);
        setCookies(response, result);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request,
            @RequestHeader(value = HttpHeaders.USER_AGENT, required = false) String userAgent,
            HttpServletResponse response) {
        AuthResponse result = authService.login(request, userAgent);
        setCookies(response, result);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = cookieService.readRefreshToken(request)
                .orElseThrow(() -> new UnauthorizedException("Сессия не найдена"));
        try {
            AuthResponse result = authService.refresh(refreshToken);
            setCookies(response, result);
            return ResponseEntity.ok(result);
        } catch (UnauthorizedException e) {
            cookieService.clearAuthCookies(response);
            throw e;
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        cookieService.readRefreshToken(request).ifPresent(authService::logout);
        cookieService.clearAuthCookies(response);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/logout-all")
    public ResponseEntity<Void> logoutAll(@AuthenticationPrincipal Jwt jwt, HttpServletResponse response) {
        authService.logoutAll(Long.valueOf(jwt.getSubject()));
        cookieService.clearAuthCookies(response);
        return ResponseEntity.noContent().build();
    }

    private void setCookies(HttpServletResponse response, AuthResponse result) {
        cookieService.addAuthCookies(response, result.getAccessToken(),
                result.getRefreshToken(), result.getRefreshExpiresAt());
    }
}