package com.zubrilovskaya.auth.service;


import com.zubrilovskaya.auth.domain.User;
import com.zubrilovskaya.auth.dto.response.AuthResponse;
import com.zubrilovskaya.auth.repository.GenderRepository;
import com.zubrilovskaya.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final GenderRepository genderRepository;
    private final PasswordEncoder passwordEncoder;


    private AuthResponse toResponse(User user) {
        return AuthResponse.builder()
                .userId(user.getId())
                .name(user.getName())
                .surname(user.getSurname())
                .email(user.getEmail())
                .build();
    }


}
