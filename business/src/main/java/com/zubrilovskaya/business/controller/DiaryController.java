package com.zubrilovskaya.business.controller;

import com.zubrilovskaya.business.dto.request.DiaryEntryRequest;
import com.zubrilovskaya.business.dto.response.DiaryEntryResponse;
import com.zubrilovskaya.business.service.DiaryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/diary")
@RequiredArgsConstructor
public class DiaryController {

    private final DiaryService diaryService;

    @PutMapping("/{date}")
    public ResponseEntity<DiaryEntryResponse> save(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @Valid @RequestBody DiaryEntryRequest request) {
        return ResponseEntity.ok(diaryService.save(userId(jwt), date, request));
    }

    @GetMapping("/{date}")
    public ResponseEntity<DiaryEntryResponse> get(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(diaryService.get(userId(jwt), date));
    }

    @GetMapping
    public ResponseEntity<List<DiaryEntryResponse>> list(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(diaryService.list(userId(jwt), from, to));
    }

    @DeleteMapping("/{date}")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        diaryService.delete(userId(jwt), date);
        return ResponseEntity.noContent().build();
    }

    private static Long userId(Jwt jwt) {
        return Long.valueOf(jwt.getSubject());
    }
}