package com.zubrilovskaya.auth.repository;

import com.zubrilovskaya.auth.domain.Session;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Session> findForUpdateByRefreshTokenHash(String refreshTokenHash);

    Optional<Session> findByIdAndUserId(Long id, Long userId);

    List<Session> findAllByUserIdOrderByLastUsedAtDesc(Long userId);

    @Modifying
    @Query("delete from Session s where s.refreshTokenHash = :hash")
    int deleteByHash(@Param("hash") String hash);

    @Modifying
    @Query("delete from Session s where s.user.id = :userId")
    int deleteAllByUserId(@Param("userId") Long userId);

    @Modifying
    @Query("delete from Session s where s.expiresAt < :now")
    int deleteExpired(@Param("now") Instant now);
}