package com.zubrilovskaya.business.security;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.oauth2.server.resource.web.BearerTokenResolver;
import org.springframework.security.oauth2.server.resource.web.DefaultBearerTokenResolver;
import org.springframework.stereotype.Component;
import org.springframework.web.util.WebUtils;

@Component
public class CookieBearerTokenResolver implements BearerTokenResolver {
    private static final String ACCESS_COOKIE = "access_token";

    private final DefaultBearerTokenResolver headerResolver = new DefaultBearerTokenResolver();

    @Override
    public String resolve(HttpServletRequest request) {
        if (request.getRequestURI().startsWith("/actuator/health")) {
            return null;
        }
        Cookie cookie = WebUtils.getCookie(request, ACCESS_COOKIE);
        if (cookie != null && !cookie.getValue().isBlank()) {
            return cookie.getValue();
        }
        return headerResolver.resolve(request);
    }
}