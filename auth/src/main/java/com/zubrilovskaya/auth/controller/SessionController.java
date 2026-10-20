package com.zubrilovskaya.auth.controller;

import com.zubrilovskaya.auth.dto.response.SessionResponse;
import com.zubrilovskaya.auth.service.CookieService;
import com.zubrilovskaya.auth.service.SessionService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/auth/sessions")
@RequiredArgsConstructor
public class SessionController {

    private final SessionService sessionService;
    private final CookieService cookieService;

    @GetMapping
    public ResponseEntity<List<SessionResponse>> list(@AuthenticationPrincipal Jwt jwt,
                                                      HttpServletRequest request) {
        String currentToken = cookieService.readRefreshToken(request).orElse(null);
        return ResponseEntity.ok(sessionService.list(Long.valueOf(jwt.getSubject()), currentToken));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> terminate(@AuthenticationPrincipal Jwt jwt, @PathVariable Long id) {
        sessionService.revokeById(Long.valueOf(jwt.getSubject()), id);
        return ResponseEntity.noContent().build();
    }
}