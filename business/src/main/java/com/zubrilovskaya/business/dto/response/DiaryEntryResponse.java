package com.zubrilovskaya.business.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.Instant;
import java.time.LocalDate;

@Getter
@Builder
@AllArgsConstructor
public class DiaryEntryResponse {
    private LocalDate date;
    private int mood;
    private int fatigue;
    private int anxiety;
    private String text;
    private Instant createdAt;
    private Instant updatedAt;
}