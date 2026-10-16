package com.zubrilovskaya.auth.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ChangePasswordRequest {

    @NotBlank(message = "Укажите текущий пароль")
    private String currentPassword;

    @NotBlank(message = "Укажите новый пароль")
    @Size(min = 6, max = 26, message = "Пароль должен быть от 6 до 26 символов")
    private String newPassword;
}
