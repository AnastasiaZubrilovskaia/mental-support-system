package com.zubrilovskaya.auth.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ChangeEmailRequest {

    @NotBlank(message = "Укажите новый email")
    @Email(message = "Некорректный email")
    private String newEmail;

    @NotBlank(message = "Подтвердите паролем")
    private String password;
}