package com.zubrilovskaya.auth.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class LoginRequest {
    @NotBlank(message = "Login (email) is required")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;
}
