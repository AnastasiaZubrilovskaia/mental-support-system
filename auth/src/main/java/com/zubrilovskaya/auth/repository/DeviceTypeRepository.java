package com.zubrilovskaya.auth.repository;

import com.zubrilovskaya.auth.domain.DeviceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DeviceTypeRepository extends JpaRepository<DeviceType, Short> {
    Optional<DeviceType> findByName(String name);
}