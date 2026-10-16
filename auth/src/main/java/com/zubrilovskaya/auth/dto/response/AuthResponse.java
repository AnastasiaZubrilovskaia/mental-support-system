package com.zubrilovskaya.auth.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.Instant;

@Getter
@Builder
@AllArgsConstructor
public class AuthResponse {
    private Long userId;
    private String name;
    private String surname;
    private String email;
    private boolean isAdmin;

    @JsonIgnore
    private String accessToken;
    @JsonIgnore
    private String refreshToken;
    @JsonIgnore
    private Instant refreshExpiresAt;
}
