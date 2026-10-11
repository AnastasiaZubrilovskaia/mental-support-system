package com.zubrilovskaya.auth.dto.response;

import com.zubrilovskaya.auth.domain.User;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.Instant;

@Getter
@AllArgsConstructor
public class AdminUserResponse {
    private Long id;
    private String name;
    private String surname;
    private String email;
    private Instant createdAt;
    private Instant lastLoginAt;
    private boolean admin;

    public static AdminUserResponse from(User u) {
        return new AdminUserResponse(u.getId(), u.getName(), u.getSurname(), u.getEmail(),
                u.getCreatedAt(), u.getLastLoginAt(), u.isAdmin());
    }
}
