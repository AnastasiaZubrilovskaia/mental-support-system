package com.zubrilovskaya.auth.service;

import com.zubrilovskaya.auth.config.SessionProperties;
import com.zubrilovskaya.auth.domain.DeviceType;
import com.zubrilovskaya.auth.domain.Session;
import com.zubrilovskaya.auth.domain.User;
import com.zubrilovskaya.auth.dto.response.SessionResponse;
import com.zubrilovskaya.auth.exception.ApiException;
import com.zubrilovskaya.auth.repository.DeviceTypeRepository;
import com.zubrilovskaya.auth.repository.SessionRepository;
import com.zubrilovskaya.auth.service.DeviceInfoService.DeviceInfo;
import com.zubrilovskaya.auth.util.RefreshTokens;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SessionService {

    private final SessionRepository sessionRepository;
    private final DeviceTypeRepository deviceTypeRepository;
    private final SessionProperties props;

    @Getter
    @AllArgsConstructor
    public static class CreatedSession {
        private String refreshToken;
        private Instant expiresAt;
    }

    @Getter
    @AllArgsConstructor
    public static class RotatedSession {
        private User user;
        private String refreshToken;
        private Instant expiresAt;
    }

    @Transactional
    public CreatedSession create(User user, DeviceInfo device) {
        String rawToken = RefreshTokens.generate();
        Instant now = Instant.now();

        Session session = new Session();
        session.setUser(user);
        session.setRefreshTokenHash(RefreshTokens.hash(rawToken));
        session.setDeviceLabel(device.getLabel());
        session.setDeviceType(resolveType(device.getType()));
        session.setExpiresAt(now.plus(props.getRefreshTtl()));
        session.setLastUsedAt(now);
        sessionRepository.save(session);

        return new CreatedSession(rawToken, session.getExpiresAt());
    }

    @Transactional
    public RotatedSession rotate(String rawToken) {
        Session session = sessionRepository
                .findForUpdateByRefreshTokenHash(RefreshTokens.hash(rawToken))
                .orElseThrow(SessionService::unauthorized);

        Instant now = Instant.now();
        if (!session.getExpiresAt().isAfter(now)) {
            throw unauthorized();
        }

        String newRawToken = RefreshTokens.generate();
        session.setRefreshTokenHash(RefreshTokens.hash(newRawToken));
        session.setLastUsedAt(now);

        return new RotatedSession(session.getUser(), newRawToken, session.getExpiresAt());
    }

    @Transactional(readOnly = true)
    public List<SessionResponse> list(Long userId, String currentRawToken) {
        String currentHash = currentRawToken == null ? null : RefreshTokens.hash(currentRawToken);
        return sessionRepository.findAllByUserIdOrderByLastUsedAtDesc(userId).stream()
                .map(s -> new SessionResponse(
                        s.getId(),
                        s.getDeviceLabel(),
                        s.getDeviceType() == null ? null : s.getDeviceType().getName(),
                        s.getCreatedAt(),
                        s.getLastUsedAt(),
                        s.getRefreshTokenHash().equals(currentHash)))
                .toList();
    }

    @Transactional
    public void revoke(String rawToken) {
        sessionRepository.deleteByHash(RefreshTokens.hash(rawToken));
    }

    @Transactional
    public void revokeAll(Long userId) {
        sessionRepository.deleteAllByUserId(userId);
    }

    @Transactional
    public void revokeById(Long userId, Long sessionId) {
        Session session = sessionRepository.findByIdAndUserId(sessionId, userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Сессия не найдена"));
        sessionRepository.delete(session);
    }

    @Transactional
    public int deleteExpired() {
        return sessionRepository.deleteExpired(Instant.now());
    }

    private DeviceType resolveType(String name) {
        return name == null ? null : deviceTypeRepository.findByName(name).orElse(null);
    }

    private static ApiException unauthorized() {
        return new ApiException(HttpStatus.UNAUTHORIZED, "Сессия недействительна, войдите заново");
    }
}