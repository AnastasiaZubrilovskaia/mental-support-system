package com.zubrilovskaya.auth.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class RegisterRequest {
    @NotBlank(message = "Имя обязательно для заполнения")
    private String name;

    private String surname;
    private Short genderId;

    @NotBlank(message = "Логин (email) обязателен для заполнения")
    @Email(message = "Некорректный email")
    private String email;

    @NotBlank(message = "Пароль обязателен для заполнения")
    @Size(min = 6, max = 26, message = "Пароль должен быть от 6 до 26 символов")
    private String password;

    @Past(message = "Дата рождения должна быть в прошлом")
    private LocalDate birthday;
}
