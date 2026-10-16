package com.zubrilovskaya.auth.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.Instant;
import java.time.LocalDate;

@Getter
@Builder
@AllArgsConstructor
public class UserResponse {
    private Long userId;
    private String name;
    private String surname;
    private String email;
    private LocalDate birthday;
    private boolean isAdmin;
    private String gender;
    private Instant lastLoginAt;
}
