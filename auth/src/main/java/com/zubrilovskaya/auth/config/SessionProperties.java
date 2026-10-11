package com.zubrilovskaya.auth.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.time.Duration;

@Getter
@Setter
@ConfigurationProperties(prefix = "app.session")
public class SessionProperties {
    private Duration refreshTtl;
}
