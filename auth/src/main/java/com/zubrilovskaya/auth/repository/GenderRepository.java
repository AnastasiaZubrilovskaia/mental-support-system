package com.zubrilovskaya.auth.repository;

import com.zubrilovskaya.auth.domain.Gender;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GenderRepository extends JpaRepository<Gender, Short> {
}
