package com.zubrilovskaya.auth.service;


import com.zubrilovskaya.auth.domain.Gender;
import com.zubrilovskaya.auth.domain.User;
import com.zubrilovskaya.auth.dto.request.LoginRequest;
import com.zubrilovskaya.auth.dto.request.RegisterRequest;
import com.zubrilovskaya.auth.dto.response.AuthResponse;
import com.zubrilovskaya.auth.exception.NotFoundException;
import com.zubrilovskaya.auth.exception.UnauthorizedException;
import com.zubrilovskaya.auth.exception.UserAlreadyExistsException;
import com.zubrilovskaya.auth.repository.GenderRepository;
import com.zubrilovskaya.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import com.zubrilovskaya.auth.service.SessionService.CreatedSession;
import com.zubrilovskaya.auth.service.SessionService.RotatedSession;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final GenderRepository genderRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    private final SessionService sessionService;
    private final DeviceInfoService deviceInfoService;


    @Transactional
    public AuthResponse register(RegisterRequest request, String userAgent) {
        User user = new User();
        String email = request.getEmail().trim().toLowerCase(Locale.ROOT);
        if (userRepository.existsByEmail(email)){
            throw new UserAlreadyExistsException("Пользователь с таким email уже существует");
        }
        user.setName(request.getName());
        user.setSurname(request.getSurname());
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));

        if (request.getGenderId() != null){
            Gender gender = genderRepository.findById(request.getGenderId())
                    .orElseThrow(() -> new NotFoundException("Пол не найден"));
            user.setGender(gender);
        }
        user.setBirthday(request.getBirthday());
        userRepository.save(user);

        CreatedSession created = sessionService.create(user, deviceInfoService.parse(userAgent));
        return buildResponse(user, created);
    }


    @Transactional
    public AuthResponse login(LoginRequest request, String userAgent){
        String email = request.getEmail().trim().toLowerCase(Locale.ROOT);
        User user = userRepository.findByEmail(email)
                .filter(u -> passwordEncoder.matches(request.getPassword(), u.getPasswordHash()))
                .orElseThrow(() ->new UnauthorizedException("Неверный email или пароль"));

        user.setLastLoginAt(Instant.now());

        CreatedSession created = sessionService.create(user, deviceInfoService.parse(userAgent));
        return buildResponse(user, created);
    }

    @Transactional
    public AuthResponse refresh(String rawRefreshToken) {
        RotatedSession rotated = sessionService.rotate(rawRefreshToken);
        User user = rotated.getUser();
        return AuthResponse.builder()
                .userId(user.getId())
                .name(user.getName())
                .surname(user.getSurname())
                .email(user.getEmail())
                .isAdmin(user.isAdmin())
                .accessToken(tokenService.createAccessToken(user))
                .refreshToken(rotated.getRefreshToken())
                .refreshExpiresAt(rotated.getExpiresAt())
                .build();
    }

    public void logout(String rawRefreshToken) {
        sessionService.revoke(rawRefreshToken);
    }

    public void logoutAll(Long userId) {
        sessionService.revokeAll(userId);
    }


    private AuthResponse buildResponse(User user, CreatedSession created) {
        return AuthResponse.builder()
                .userId(user.getId())
                .name(user.getName())
                .surname(user.getSurname())
                .email(user.getEmail())
                .isAdmin(user.isAdmin())
                .accessToken(tokenService.createAccessToken(user))
                .refreshToken(created.getRefreshToken())
                .refreshExpiresAt(created.getExpiresAt())
                .build();
    }


}
