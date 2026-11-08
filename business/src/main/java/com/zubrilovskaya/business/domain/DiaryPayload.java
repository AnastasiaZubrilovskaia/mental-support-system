package com.zubrilovskaya.business.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DiaryPayload {
    private String text;
    private int mood; //настроение
    private int fatigue; //усталость
    private int anxiety; //тревожность
}
