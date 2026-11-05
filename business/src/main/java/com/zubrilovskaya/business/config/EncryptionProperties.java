package com.zubrilovskaya.business.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "app.encryption")
public class EncryptionProperties {
    private String key;
}
