package com.zubrilovskaya.auth.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.Instant;

@Getter
@AllArgsConstructor
public class SessionResponse {
    private Long id;
    private String deviceLabel;
    private String deviceType;
    private Instant createdAt;
    private Instant lastUsedAt;
    private boolean current;
}