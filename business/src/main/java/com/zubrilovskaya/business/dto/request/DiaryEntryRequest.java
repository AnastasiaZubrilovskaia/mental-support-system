package com.zubrilovskaya.business.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class DiaryEntryRequest {

    @NotNull(message = "Укажите настроение")
    @Min(value = 1, message = "Настроение: от 1 до 10")
    @Max(value = 10, message = "Настроение: от 1 до 10")
    private Integer mood;

    @NotNull(message = "Укажите уровень усталости")
    @Min(value = 1, message = "Усталость: от 1 до 10")
    @Max(value = 10, message = "Усталость: от 1 до 10")
    private Integer fatigue;

    @NotNull(message = "Укажите уровень тревожности")
    @Min(value = 1, message = "Тревожность: от 1 до 10")
    @Max(value = 10, message = "Тревожность: от 1 до 10")
    private Integer anxiety;

    @Size(max = 5000, message = "Текст не длиннее 5000 символов")
    private String text;
}