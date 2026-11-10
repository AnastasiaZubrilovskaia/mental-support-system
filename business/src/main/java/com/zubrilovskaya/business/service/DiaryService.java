package com.zubrilovskaya.business.service;

import com.zubrilovskaya.business.domain.DiaryEntry;
import com.zubrilovskaya.business.domain.DiaryPayload;
import com.zubrilovskaya.business.dto.request.DiaryEntryRequest;
import com.zubrilovskaya.business.dto.response.DiaryEntryResponse;
import com.zubrilovskaya.business.exception.BadRequestException;
import com.zubrilovskaya.business.exception.ConflictException;
import com.zubrilovskaya.business.exception.NotFoundException;
import com.zubrilovskaya.business.repository.DiaryEntryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import tools.jackson.databind.json.JsonMapper;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DiaryService {

    private static final String COLLECTION = "diary_entries";

    private final DiaryEntryRepository repository;
    private final FieldEncryptor encryptor;
    private final JsonMapper jsonMapper;

    //Создание записи за день или замена существующей
    public DiaryEntryResponse save(Long userId, LocalDate date, DiaryEntryRequest request) {
        checkDateAllowed(date);
        String dateKey = date.toString();

        DiaryPayload payload = new DiaryPayload(
                blankToNull(request.getText()), request.getMood(), request.getFatigue(), request.getAnxiety());
        String encrypted = encryptor.encrypt(jsonMapper.writeValueAsString(payload), context(userId, dateKey));

        Instant now = Instant.now();
        DiaryEntry entry = repository.findByUserIdAndDate(userId, dateKey).orElseGet(() -> {
            DiaryEntry created = new DiaryEntry();
            created.setUserId(userId);
            created.setDate(dateKey);
            created.setCreatedAt(now);
            return created;
        });
        entry.setPayload(encrypted);
        entry.setUpdatedAt(now);

        try {
            repository.save(entry);
        } catch (DuplicateKeyException e) {
            throw new ConflictException("Запись за этот день уже сохраняется, повторите запрос");
        }
        return toResponse(entry, payload);
    }

    public DiaryEntryResponse get(Long userId, LocalDate date) {
        DiaryEntry entry = repository.findByUserIdAndDate(userId, date.toString())
                .orElseThrow(() -> new NotFoundException("Запись за " + date + " не найдена"));
        return toResponse(entry);
    }

    //история записей (новые сверху)
    public List<DiaryEntryResponse> list(Long userId, LocalDate from, LocalDate to) {
        if (from != null && to != null && from.isAfter(to)) {
            throw new BadRequestException("Начало периода позже его конца");
        }
        String fromKey = from == null ? "0000-01-01" : from.toString();
        String toKey = to == null ? "9999-12-31" : to.toString();

        return repository
                .findByUserIdAndDateBetween(userId, fromKey, toKey)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public void delete(Long userId, LocalDate date) {
        if (repository.deleteByUserIdAndDate(userId, date.toString()) == 0) {
            throw new NotFoundException("Запись за " + date + " не найдена");
        }
    }

    private void checkDateAllowed(LocalDate date) {
        if (date.isAfter(LocalDate.now(ZoneOffset.UTC).plusDays(1))) {
            throw new BadRequestException("Нельзя создать запись на будущую дату");
        }
    }

    private static String context(Long userId, String dateKey) {
        return FieldEncryptor.context(COLLECTION, userId, dateKey);
    }

    private DiaryEntryResponse toResponse(DiaryEntry entry) {
        String json = encryptor.decrypt(entry.getPayload(), context(entry.getUserId(), entry.getDate()));
        return toResponse(entry, jsonMapper.readValue(json, DiaryPayload.class));
    }

    private DiaryEntryResponse toResponse(DiaryEntry entry, DiaryPayload payload) {
        return DiaryEntryResponse.builder()
                .date(LocalDate.parse(entry.getDate()))
                .mood(payload.getMood())
                .fatigue(payload.getFatigue())
                .anxiety(payload.getAnxiety())
                .text(payload.getText())
                .createdAt(entry.getCreatedAt())
                .updatedAt(entry.getUpdatedAt())
                .build();
    }

    private static String blankToNull(String s) {
        return (s == null || s.isBlank()) ? null : s.trim();
    }
}