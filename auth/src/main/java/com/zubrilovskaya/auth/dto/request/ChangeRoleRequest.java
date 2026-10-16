package com.zubrilovskaya.auth.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ChangeRoleRequest {
    @NotNull(message = "Укажите роль")
    private Boolean admin;
}