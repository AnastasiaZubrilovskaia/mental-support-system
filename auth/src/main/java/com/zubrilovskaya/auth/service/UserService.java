package com.zubrilovskaya.auth.service;

import com.zubrilovskaya.auth.domain.User;
import com.zubrilovskaya.auth.dto.request.ChangeEmailRequest;
import com.zubrilovskaya.auth.dto.request.ChangePasswordRequest;
import com.zubrilovskaya.auth.dto.request.UpdateProfileRequest;
import com.zubrilovskaya.auth.dto.response.UserResponse;
import com.zubrilovskaya.auth.exception.BadRequestException;
import com.zubrilovskaya.auth.exception.ForbiddenException;
import com.zubrilovskaya.auth.exception.NotFoundException;
import com.zubrilovskaya.auth.exception.UserAlreadyExistsException;
import com.zubrilovskaya.auth.repository.GenderRepository;
import com.zubrilovskaya.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final SessionService sessionService;
    private final PasswordEncoder passwordEncoder;

    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Пользователь с данным id не найден"));
        return toResponse(user);
    }

    public List<UserResponse> getAllUsers() {
        List<UserResponse> users = userRepository.findAll().stream()
                .map(this::toResponse)
                .toList();

        return users;
    }

    @Transactional
    public UserResponse update(Long id, UpdateProfileRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Пользователь не найден"));

        if (request.getName() != null) {
            if (request.getName().isBlank()) {
                throw new BadRequestException("Имя не может быть пустым");
            }
            user.setName(request.getName());
        }
        if (request.getSurname() != null) {
            user.setSurname(request.getSurname());
        }
        if (request.getBirthday() != null) {
            user.setBirthday(request.getBirthday());
        }
        return toResponse(user);
    }

    @Transactional
    public UserResponse changeEmail(Long id, ChangeEmailRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Пользователь с данным id не найден"));

        verifyPassword(user, request.getPassword());

        String email = request.getNewEmail().trim().toLowerCase();

        if (email.equals(user.getEmail())) {
            throw new BadRequestException("Новый email совпадает с текущим");
        }
        if (userRepository.existsByEmail(email)) {
            throw new UserAlreadyExistsException("Пользователь с таким email уже существует");
        }

        user.setEmail(email);
        userRepository.save(user);

        return toResponse(user);
    }

    @Transactional
    public void changePassword(Long id, ChangePasswordRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Пользователь с данным id не найден"));

        verifyPassword(user, request.getCurrentPassword());

        if (passwordEncoder.matches(request.getNewPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Новый пароль совпадает с текущим");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        sessionService.revokeAll(id);
    }

    @Transactional
    public void deleteAccount(Long id) {
        User user =  userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Пользователь не найден"));
        if (user.isAdmin()) {
            throw new ForbiddenException("Нельзя удалить учётную запись администратора");
        }
        userRepository.delete(user);
    }

    //для админа
    @Transactional
    public UserResponse changeRole(Long adminId, Long id, boolean makeAdmin) {
        if (adminId.equals(id)) {
            throw new ForbiddenException("Нельзя изменить собственную роль");
        }
        User target = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Пользователь не найден"));
        target.setAdmin(makeAdmin);
        return toResponse(target);
    }

    //для админа
    @Transactional
    public void deleteUser(Long id) {
        User target = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Пользователь не найден"));
        if (target.isAdmin()) {
            throw new ForbiddenException("Нельзя удалить администратора: сначала снимите с него роль");
        }
        userRepository.delete(target);
    }

    private UserResponse toResponse(User user) {
        return UserResponse.builder()
                .userId(user.getId())
                .name(user.getName())
                .surname(user.getSurname())
                .email(user.getEmail())
                .birthday(user.getBirthday())
                .gender(user.getGender().getName())
                .isAdmin(user.isAdmin())
                .lastLoginAt(user.getLastLoginAt())
                .build();
    }

    private void verifyPassword(User user, String rawPassword) {
        if (!passwordEncoder.matches(rawPassword, user.getPasswordHash())) {
            throw new BadRequestException("Неверный пароль");
        }
    }
}
