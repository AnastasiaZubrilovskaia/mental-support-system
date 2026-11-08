package com.zubrilovskaya.business.repository;

import com.zubrilovskaya.business.domain.DiaryEntry;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DiaryEntryRepository extends MongoRepository<DiaryEntry, String> {

    Optional<DiaryEntry> findByUserIdAndDate(Long userId, String date);

    List<DiaryEntry> findByUserIdAndDateGreaterThanEqualAndDateLessThanEqualOrderByDateDesc(
            Long userId, String from, String to);

    long deleteByUserIdAndDate(Long userId, String date);
}