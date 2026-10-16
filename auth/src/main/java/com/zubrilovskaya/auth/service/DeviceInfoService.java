package com.zubrilovskaya.auth.service;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.stereotype.Service;

@Service
public class DeviceInfoService {

    @Getter
    @AllArgsConstructor
    public static class DeviceInfo {
        private String label;
        private String type;
    }

    public DeviceInfo parse(String userAgent) {
        if (userAgent == null || userAgent.isBlank()) {
            return new DeviceInfo("Неизвестное устройство", null);
        }
        String browser = detectBrowser(userAgent);
        String platform = detectPlatform(userAgent);
        String label = platform == null ? browser : browser + " на " + platform;
        if (label.length() > 100) {
            label = label.substring(0, 100);
        }
        return new DeviceInfo(label, detectType(userAgent));
    }

    private String detectBrowser(String ua) {
        if (ua.contains("YaBrowser")) return "Яндекс Браузер";
        if (ua.contains("Edg/") || ua.contains("EdgA/") || ua.contains("EdgiOS/")) return "Edge";
        if (ua.contains("OPR/") || ua.contains("Opera")) return "Opera";
        if (ua.contains("SamsungBrowser")) return "Samsung Internet";
        if (ua.contains("Firefox/") || ua.contains("FxiOS/")) return "Firefox";
        if (ua.contains("Chrome/") || ua.contains("CriOS/")) return "Chrome";
        if (ua.contains("Safari/")) return "Safari";
        return "Браузер";
    }

    private String detectPlatform(String ua) {
        if (ua.contains("iPhone")) return "iPhone";
        if (ua.contains("iPad")) return "iPad";
        if (ua.contains("Android")) return "Android";
        if (ua.contains("Windows")) return "Windows";
        if (ua.contains("Macintosh") || ua.contains("Mac OS X")) return "macOS";
        if (ua.contains("CrOS")) return "ChromeOS";
        if (ua.contains("Linux")) return "Linux";
        return null;
    }

    private String detectType(String ua) {
        if (ua.contains("iPad") || (ua.contains("Android") && !ua.contains("Mobile"))) return "tablet";
        if (ua.contains("iPhone") || ua.contains("Mobile")) return "mobile";
        return "desktop";
    }
}