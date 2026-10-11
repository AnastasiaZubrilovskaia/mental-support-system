package com.zubrilovskaya.auth.config;

import com.zubrilovskaya.auth.domain.User;
import com.zubrilovskaya.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

/** При старте создаёт администратора, если заданы ADMIN_EMAIL и ADMIN_PASSWORD и такого пользователя ещё нет. */
@Slf4j
@Component
@RequiredArgsConstructor
public class AdminInitializer implements ApplicationRunner {

    private final AdminProperties props;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (isBlank(props.getEmail()) || isBlank(props.getPassword())) {
            return;
        }
        String email = props.getEmail().trim().toLowerCase(Locale.ROOT);
        if (userRepository.existsByEmail(email)) {
            return;
        }
        User admin = new User();
        admin.setName("Администратор");
        admin.setEmail(email);
        admin.setPasswordHash(passwordEncoder.encode(props.getPassword()));
        admin.setAdmin(true);
        userRepository.save(admin);
        log.info("Создан администратор {}", email);
    }

    private static boolean isBlank(String s) {
        return s == null || s.isBlank();
    }
}