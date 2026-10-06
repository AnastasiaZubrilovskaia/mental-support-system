package com.zubrilovskaya.auth.domain;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "types_of_devices")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DeviceType {
    @Id
    private Short id;

    @Column(unique = true, nullable = false)
    private String name;
}
