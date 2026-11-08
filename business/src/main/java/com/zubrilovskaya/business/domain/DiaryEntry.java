package com.zubrilovskaya.business.domain;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@Document(collection = "diary_entries")
public class DiaryEntry {
    @Id
    private String id;

    private Long userId;
    private String date;
    private String payload;
    private Instant createdAt;
    private Instant updatedAt;
}
