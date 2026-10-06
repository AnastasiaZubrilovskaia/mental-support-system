package com.zubrilovskaya.auth.repository;

import com.zubrilovskaya.auth.domain.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {
    Optional<Session> findByRefreshTokenHash(String hash);
    List<Session> findAllByUserId(Long userId);
    Optional<Session> findByIdAndUserId(Long id, Long userId);
    void deleteAllByUserId(Long userId);
}
