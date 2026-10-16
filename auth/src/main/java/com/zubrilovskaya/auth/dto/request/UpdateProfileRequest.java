package com.zubrilovskaya.auth.dto.request;

import jakarta.validation.constraints.Past;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class UpdateProfileRequest {
    private String name;

    private String surname;

    @Past(message = "Дата рождения должна быть в прошлом")
    private LocalDate birthday;
}