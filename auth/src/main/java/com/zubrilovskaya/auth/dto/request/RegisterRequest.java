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
    @NotBlank(message = "Name is required")
    private String name;

    private String surname;
    private Short genderId;

    @NotBlank(message = "Login (email) is required")
    @Email(message = "Некорректный email")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;

    @Past(message = "Дата рождения должна быть в прошлом")
    private LocalDate birthday;
}
