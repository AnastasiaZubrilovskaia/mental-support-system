package com.zubrilovskaya.auth.controller;

import com.zubrilovskaya.auth.dto.request.ChangeEmailRequest;
import com.zubrilovskaya.auth.dto.request.ChangePasswordRequest;
import com.zubrilovskaya.auth.dto.request.UpdateProfileRequest;
import com.zubrilovskaya.auth.dto.response.UserResponse;
import com.zubrilovskaya.auth.service.CookieService;
import com.zubrilovskaya.auth.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users/me")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final CookieService cookieService;

    @GetMapping
    public ResponseEntity<UserResponse> getProfile(@AuthenticationPrincipal Jwt jwt) {
        UserResponse response = userService.getUserById(userId(jwt));
        return ResponseEntity.ok(response);
    }

    @PatchMapping
    public ResponseEntity<UserResponse> updateProfile(@AuthenticationPrincipal Jwt jwt,
                                      @Valid @RequestBody UpdateProfileRequest request) {
        UserResponse response = userService.update(userId(jwt), request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/email")
    public ResponseEntity<UserResponse> changeEmail(@AuthenticationPrincipal Jwt jwt,
                                    @Valid @RequestBody ChangeEmailRequest request) {
        UserResponse response = userService.changeEmail(userId(jwt), request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/password")
    public ResponseEntity<Void> changePassword(@AuthenticationPrincipal Jwt jwt,
                                               @Valid @RequestBody ChangePasswordRequest request,
                                               HttpServletResponse response) {
        userService.changePassword(userId(jwt), request);
        cookieService.clearAuthCookies(response);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteAccount(@AuthenticationPrincipal Jwt jwt,
                                              HttpServletResponse response) {
        userService.deleteAccount(userId(jwt));
        cookieService.clearAuthCookies(response);
        return ResponseEntity.noContent().build();
    }


    private static Long userId(Jwt jwt) {
        return Long.valueOf(jwt.getSubject());
    }
}
